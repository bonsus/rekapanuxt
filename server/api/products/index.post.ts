import { readBody, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const SkuSchema = z.object({
  mpSkuId: z.string().default(''),
  sku: z.string().default(''),
  price: z.number().min(0, 'Price must be >= 0'),
  hpp: z.number().min(0, 'HPP must be >= 0'),
  variants: z.record(z.string()).default({}),
})

const CreateProductSchema = z.object({
  storeId: z.string().min(1, 'storeId is required'),
  mpProductId: z.string().min(1, 'MP Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  variantTypes: z.array(z.string()).max(2, 'Maximum 2 variant types').default([]),
  skus: z.array(SkuSchema).min(1, 'At least one SKU is required'),
})

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const body = await readBody(event)
  const parsed = CreateProductSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0]?.message ?? 'Validation error' })
  }

  const { storeId, mpProductId, name, description, category, status, variantTypes, skus } = parsed.data

  // Verify store belongs to user
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  try {
    const product = await prisma.product.create({
      data: {
        mpProductId,
        name,
        description,
        category,
        status,
        variantTypes,
        storeId,
        skus: {
          create: skus.map((s) => ({
            mpSkuId: s.mpSkuId || crypto.randomUUID(),
            sku: s.sku,
            price: s.price,
            hpp: s.hpp,
            variants: s.variants,
            storeId,
          })),
        },
      },
      include: { skus: true },
    })
    return { success: true, message: 'Product created successfully', data: product }
  } catch (err: unknown) {
    const e = err as { code?: string }
    if (e.code === 'P2002') {
      throw createError({ statusCode: 409, message: 'MP SKU ID sudah digunakan di toko ini. Gunakan ID yang berbeda.' })
    }
    throw err
  }
})
