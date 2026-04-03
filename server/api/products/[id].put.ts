import { readBody, getRouterParam, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const SkuSchema = z.object({
  id: z.string().optional(),
  mpSkuId: z.string().default(''),
  sku: z.string().default(''),
  price: z.number().min(0),
  hpp: z.number().min(0),
  variants: z.record(z.string()).default({}),
})

const UpdateProductSchema = z.object({
  mpProductId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  variantTypes: z.array(z.string()).max(2).optional(),
  skus: z.array(SkuSchema).min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Product ID is required' })

  const product = await prisma.product.findUnique({
    where: { id },
    include: { store: { select: { userId: true, id: true } } },
  })
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })
  if (product.store.userId !== payload.sub) throw createError({ statusCode: 403, message: 'Forbidden' })

  const body = await readBody(event)
  const parsed = UpdateProductSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0]?.message ?? 'Validation error' })
  }

  const { skus, ...productFields } = parsed.data
  const storeId = product.store.id

  let updated
  try {
  updated = await prisma.$transaction(async (tx) => {
    // Update product fields
    await tx.product.update({ where: { id }, data: productFields })

    if (skus !== undefined) {
      const incomingIds = skus.filter((s) => s.id).map((s) => s.id as string)

      // Delete SKUs not present in incoming list
      await tx.sku.deleteMany({ where: { productId: id, id: { notIn: incomingIds } } })

      // Upsert each SKU
      for (const sku of skus) {
        if (sku.id) {
          await tx.sku.update({
            where: { id: sku.id },
            data: { mpSkuId: sku.mpSkuId || crypto.randomUUID(), sku: sku.sku, price: sku.price, hpp: sku.hpp, variants: sku.variants },
          })
        } else {
          await tx.sku.create({
            data: { mpSkuId: sku.mpSkuId || crypto.randomUUID(), sku: sku.sku, price: sku.price, hpp: sku.hpp, variants: sku.variants, productId: id, storeId },
          })
        }
      }
    }

    return tx.product.findUnique({ where: { id }, include: { skus: { orderBy: { createdAt: 'asc' } } } })
  })
  } catch (err: unknown) {
    const e = err as { code?: string }
    if (e.code === 'P2002') {
      throw createError({ statusCode: 409, message: 'MP SKU ID sudah digunakan di toko ini. Gunakan ID yang berbeda.' })
    }
    throw err
  }

  if (!updated) throw createError({ statusCode: 500, message: 'Failed to retrieve updated product' })

  return { success: true, message: 'Product updated successfully', data: updated }
})
