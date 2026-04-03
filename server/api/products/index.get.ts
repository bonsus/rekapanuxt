import { getQuery, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const query = getQuery(event)

  const storeId = String(query.storeId ?? '')
  if (!storeId) throw createError({ statusCode: 400, message: 'storeId is required' })

  // Verify store belongs to user
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  const page = Math.max(1, parseInt(String(query.page ?? '1')))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'))))
  const search = String(query.search ?? '').trim()
  const status = String(query.status ?? '')

  const where: {
    storeId: string
    status?: 'ACTIVE' | 'INACTIVE'
    OR?: object[]
  } = { storeId }

  if (status === 'ACTIVE' || status === 'INACTIVE') where.status = status
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { mpProductId: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      select: {
        id: true,
        mpProductId: true,
        name: true,
        description: true,
        status: true,
        variantTypes: true,
        storeId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { skus: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return {
    success: true,
    data: products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  }
})
