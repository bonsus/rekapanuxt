import { readBody, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const Schema = z.object({
  date:        z.string().min(1).optional(),
  type:        z.enum(['ORDER', 'ADS', 'LOGISTIC', 'WITHDRAW']).optional(),
  cashFlow:    z.enum(['IN', 'OUT']).optional(),
  source:      z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  amount:      z.number().min(0).optional(),
  platformFee: z.number().min(0).optional(),
  affiliateFee: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  note:        z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id   = event.context.params?.id as string
  const body = await readBody(event)
  const d    = Schema.parse(body)

  // @ts-ignore: financeTransaction added in latest migration
  const tx = await prisma.financeTransaction.findUnique({
    where: { id },
    include: { store: { select: { userId: true } } },
  })
  if (!tx)               throw createError({ statusCode: 404, message: 'Transaksi tidak ditemukan' })
  if (tx.store.userId !== user.sub) throw createError({ statusCode: 403, message: 'Akses ditolak' })

  const amount      = d.amount      ?? Number(tx.amount)
  const platformFee = d.platformFee ?? Number(tx.platformFee)
  const affiliateFee = d.affiliateFee ?? Number(tx.affiliateFee)
  const shippingFee = d.shippingFee ?? Number((tx as unknown as Record<string, unknown>).shippingFee ?? 0)
  const netAmount   = amount - platformFee - affiliateFee

  // @ts-ignore
  const updated = await prisma.financeTransaction.update({
    where: { id },
    data: {
      ...(d.date        ? { date:        new Date(d.date) }             : {}),
      ...(d.type        ? { type:     d.type as string }     : {}),
      ...(d.cashFlow    ? { cashFlow: d.cashFlow as string }  : {}),
      ...(d.source      !== undefined ? { source: (d.source ?? null) as string | null } : {}),
      ...(d.referenceId !== undefined ? { referenceId: d.referenceId ?? null }               : {}),
      ...(d.note        !== undefined ? { note: d.note ?? null }                              : {}),
      amount,
      platformFee,
      affiliateFee,
      shippingFee,
      netAmount,
    },
  })

  return { success: true, message: 'Transaksi berhasil diperbarui', data: updated }
})
