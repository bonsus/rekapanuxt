import { readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  expiredAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const parsed = CreateUserSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Validation error',
    })
  }

  const { name, email, password, role, status, expiredAt } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email is already in use' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      status,
      expiredAt: expiredAt ? new Date(expiredAt) : null,
    },
    select: { id: true, name: true, email: true, role: true, status: true, expiredAt: true, createdAt: true },
  })

  return { success: true, message: 'User created successfully', data: user }
})
