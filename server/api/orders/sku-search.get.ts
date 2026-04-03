import { createError, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const { storeId, q } = getQuery(event) as { storeId?: string; q?: string }

  if (!storeId) throw createError({ statusCode: 400, message: 'storeId is required' })

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  const search = (q ?? '').trim()

  const skus = await prisma.sku.findMany({
    where: {
      storeId,
      ...(search ? {
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { mpSkuId: { contains: search, mode: 'insensitive' } },
          { product: { name: { contains: search, mode: 'insensitive' } } },
        ],
      } : {}),
    },
    include: {
      product: { select: { id: true, name: true, category: true } },
    },
    take: 20,
    orderBy: [{ product: { name: 'asc' } }, { sku: 'asc' }],
  })

  const results = skus.map(s => ({
    skuId: s.id,
    productId: s.product.id,
    sku: s.sku,
    mpSkuId: s.mpSkuId ?? '',
    productName: s.product.name,
    productCategory: s.product.category ?? null,
    price: Number(s.price),
    hpp: Number(s.hpp),
    variants: s.variants ?? {},
  }))

  return { success: true, data: results }
})
