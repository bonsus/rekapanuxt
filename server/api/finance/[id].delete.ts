import { createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id   = event.context.params?.id as string

  // @ts-ignore: financeTransaction added in latest migration
  const tx = await prisma.financeTransaction.findUnique({
    where: { id },
    include: { store: { select: { userId: true } } },
  })
  if (!tx)               throw createError({ statusCode: 404, message: 'Transaksi tidak ditemukan' })
  if (tx.store.userId !== user.sub) throw createError({ statusCode: 403, message: 'Akses ditolak' })

  // @ts-ignore
  await prisma.financeTransaction.delete({ where: { id } })
  return { success: true, message: 'Transaksi berhasil dihapus' }
})
