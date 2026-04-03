import { readBody, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const CreateStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  type: z.enum(['SHOPEE', 'TIKTOK'], { message: 'Type must be SHOPEE or TIKTOK' }),
  description: z.string().max(500).nullable().optional(),
  link: z.string().url('Invalid URL').nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)

  const body = await readBody(event)
  const parsed = CreateStoreSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Validation error',
    })
  }

  const { name, type, description, link } = parsed.data

  const store = await prisma.store.create({
    data: {
      name,
      type,
      description: description ?? null,
      link: link ?? null,
      userId: payload.sub,
    },
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

  return { success: true, message: 'Store created successfully', data: store }
})
