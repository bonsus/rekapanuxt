import { createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id   = event.context.params?.id as string

  // @ts-ignore
  const ad = await prisma.tikTokAd.findUnique({ where: { id } })
  if (!ad) throw createError({ statusCode: 404, message: 'Data tidak ditemukan' })

  const store = await prisma.store.findFirst({ where: { id: ad.storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Akses ditolak' })

  // @ts-ignore
  await prisma.tikTokAd.delete({ where: { id } })

  return { success: true }
})
