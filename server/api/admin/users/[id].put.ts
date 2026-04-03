import { readBody, getRouterParam, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  role: z.enum(['ADMIN', 'USER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  expiredAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  const body = await readBody(event)
  const parsed = UpdateUserSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Validation error',
    })
  }

  const { name, email, password, role, status, expiredAt } = parsed.data

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw createError({ statusCode: 409, message: 'Email is already in use' })
    }
  }

  const updateData: Record<string, unknown> = {}
  if (name) updateData.name = name
  if (email) updateData.email = email
  if (role) updateData.role = role
  if (status) updateData.status = status
  if (password) updateData.password = await bcrypt.hash(password, 12)
  if (expiredAt !== undefined) updateData.expiredAt = expiredAt ? new Date(expiredAt) : null

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, status: true, expiredAt: true, createdAt: true },
  })

  return { success: true, message: 'User updated successfully', data: updated }
})
