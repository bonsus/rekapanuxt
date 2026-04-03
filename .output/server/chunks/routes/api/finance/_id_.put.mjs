import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { a as requireAuth } from '../../../_/auth.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../../_/jwt.mjs';
import 'jose';
import '@prisma/client';

const Schema = z.object({
  date: z.string().min(1).optional(),
  type: z.enum(["ORDER", "ADS", "LOGISTIC", "WITHDRAW"]).optional(),
  cashFlow: z.enum(["IN", "OUT"]).optional(),
  source: z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  amount: z.number().min(0).optional(),
  platformFee: z.number().min(0).optional(),
  affiliateFee: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  note: z.string().nullable().optional()
});
const _id__put = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const user = await requireAuth(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const body = await readBody(event);
  const d = Schema.parse(body);
  const tx = await prisma.financeTransaction.findUnique({
    where: { id },
    include: { store: { select: { userId: true } } }
  });
  if (!tx) throw createError({ statusCode: 404, message: "Transaksi tidak ditemukan" });
  if (tx.store.userId !== user.sub) throw createError({ statusCode: 403, message: "Akses ditolak" });
  const amount = (_b = d.amount) != null ? _b : Number(tx.amount);
  const platformFee = (_c = d.platformFee) != null ? _c : Number(tx.platformFee);
  const affiliateFee = (_d = d.affiliateFee) != null ? _d : Number(tx.affiliateFee);
  const shippingFee = (_f = d.shippingFee) != null ? _f : Number((_e = tx.shippingFee) != null ? _e : 0);
  const netAmount = amount - platformFee - affiliateFee;
  const updated = await prisma.financeTransaction.update({
    where: { id },
    data: {
      ...d.date ? { date: new Date(d.date) } : {},
      ...d.type ? { type: d.type } : {},
      ...d.cashFlow ? { cashFlow: d.cashFlow } : {},
      ...d.source !== void 0 ? { source: (_g = d.source) != null ? _g : null } : {},
      ...d.referenceId !== void 0 ? { referenceId: (_h = d.referenceId) != null ? _h : null } : {},
      ...d.note !== void 0 ? { note: (_i = d.note) != null ? _i : null } : {},
      amount,
      platformFee,
      affiliateFee,
      shippingFee,
      netAmount
    }
  });
  return { success: true, message: "Transaksi berhasil diperbarui", data: updated };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
