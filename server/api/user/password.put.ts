import { readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default defineEventHandler(async (event) => {
  const authPayload = await requireAuth(event)

  const body = await readBody(event)
  const parsed = UpdatePasswordSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Validation error',
    })
  }

  const { currentPassword, newPassword } = parsed.data

  const user = await prisma.user.findUnique({ where: { id: authPayload.sub } })
  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password)
  if (!isCurrentValid) {
    throw createError({ statusCode: 400, message: 'Current password is incorrect' })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  return { success: true, message: 'Password updated successfully' }
})
