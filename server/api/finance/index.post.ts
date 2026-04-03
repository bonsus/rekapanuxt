import { readBody, createError } from 'h3'
import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const Schema = z.object({
  storeId:     z.string().min(1),
  date:        z.string().min(1),
  type:        z.enum(['ORDER', 'ADS', 'LOGISTIC', 'WITHDRAW']),
  cashFlow:    z.enum(['IN', 'OUT']),
  source:      z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  amount:      z.number().min(0),
  platformFee: z.number().min(0).default(0),
  affiliateFee: z.number().min(0).default(0),
  shippingFee: z.number().min(0).default(0),
  note:        z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const d    = Schema.parse(body)

  const store = await prisma.store.findFirst({ where: { id: d.storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  const netAmount = d.amount - d.platformFee - d.affiliateFee

  // @ts-ignore: financeTransaction added in latest migration
  const tx = await prisma.financeTransaction.create({
    data: {
      storeId:     d.storeId,
      date:        new Date(d.date),
      type:        d.type as string,
      cashFlow:    d.cashFlow as string,
      source:      (d.source ?? null) as string | null,
      referenceId: d.referenceId ?? null,
      amount:      d.amount,
      platformFee: d.platformFee,
      affiliateFee: d.affiliateFee,
      shippingFee: d.shippingFee,
      netAmount,
      note:        d.note ?? null,
    },
  })

  return { success: true, message: 'Transaksi berhasil dibuat', data: tx }
})
