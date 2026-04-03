import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { z } from 'zod';
import { a as requireAuth } from '../../_/auth.mjs';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../_/jwt.mjs';
import 'jose';
import '@prisma/client';

const Schema = z.object({
  storeId: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(["ORDER", "ADS", "LOGISTIC", "WITHDRAW"]),
  cashFlow: z.enum(["IN", "OUT"]),
  source: z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  amount: z.number().min(0),
  platformFee: z.number().min(0).default(0),
  affiliateFee: z.number().min(0).default(0),
  shippingFee: z.number().min(0).default(0),
  note: z.string().nullable().optional()
});
const index_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const user = await requireAuth(event);
  const body = await readBody(event);
  const d = Schema.parse(body);
  const store = await prisma.store.findFirst({ where: { id: d.storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const netAmount = d.amount - d.platformFee - d.affiliateFee;
  const tx = await prisma.financeTransaction.create({
    data: {
      storeId: d.storeId,
      date: new Date(d.date),
      type: d.type,
      cashFlow: d.cashFlow,
      source: (_a = d.source) != null ? _a : null,
      referenceId: (_b = d.referenceId) != null ? _b : null,
      amount: d.amount,
      platformFee: d.platformFee,
      affiliateFee: d.affiliateFee,
      shippingFee: d.shippingFee,
      netAmount,
      note: (_c = d.note) != null ? _c : null
    }
  });
  return { success: true, message: "Transaksi berhasil dibuat", data: tx };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
