import { getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)

  const query = getQuery(event)

  const page = Math.max(1, parseInt(String(query.page ?? '1')))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '10'))))
  const search = String(query.search ?? '').trim()
  const type = String(query.type ?? '')

  // Users only see their own stores
  const where: { userId: string; type?: 'SHOPEE' | 'TIKTOK'; OR?: object[] } = { userId: payload.sub }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (type === 'SHOPEE' || type === 'TIKTOK') {
    where.type = type
  }

  const [total, stores] = await prisma.$transaction([
    prisma.store.count({ where }),
    prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        link: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return {
    success: true,
    data: stores,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
