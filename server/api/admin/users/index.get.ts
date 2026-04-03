import { getQuery } from 'h3'
import type { Prisma } from '@prisma/client'
import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)

  const page = Math.max(1, parseInt(String(query.page ?? '1')))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '10'))))
  const search = String(query.search ?? '').trim()
  const role = String(query.role ?? '')
  const status = String(query.status ?? '')

  const where: Prisma.UserWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (role === 'ADMIN' || role === 'USER') {
    where.role = role
  }

  if (status === 'ACTIVE' || status === 'INACTIVE') {
    where.status = status
  }

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        expiredAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return {
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
