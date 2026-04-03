import { getRouterParam, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Product ID is required' })

  const product = await prisma.product.findUnique({
    where: { id },
    include: { store: { select: { userId: true } } },
  })
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })
  if (product.store.userId !== payload.sub) throw createError({ statusCode: 403, message: 'Forbidden' })

  await prisma.product.delete({ where: { id } })

  return { success: true, message: 'Product deleted successfully' }
})
