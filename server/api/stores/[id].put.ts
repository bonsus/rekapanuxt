import { readBody, getRouterParam, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const UpdateStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').optional(),
  type: z.enum(['SHOPEE', 'TIKTOK']).optional(),
  description: z.string().max(500).nullable().optional(),
  link: z.string().url('Invalid URL').nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Store ID is required' })
  }

  // Ensure the store belongs to the current user
  const store = await prisma.store.findUnique({ where: { id } })
  if (!store) {
    throw createError({ statusCode: 404, message: 'Store not found' })
  }
  if (store.userId !== payload.sub) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)
  const parsed = UpdateStoreSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Validation error',
    })
  }

  const { name, type, description, link } = parsed.data

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (type !== undefined) updateData.type = type
  if (description !== undefined) updateData.description = description
  if (link !== undefined) updateData.link = link

  const updated = await prisma.store.update({
    where: { id },
    data: updateData,
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
  })

  return { success: true, message: 'Store updated successfully', data: updated }
})
