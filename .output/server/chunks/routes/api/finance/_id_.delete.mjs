import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const user = await requireAuth(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const tx = await prisma.financeTransaction.findUnique({
    where: { id },
    include: { store: { select: { userId: true } } }
  });
  if (!tx) throw createError({ statusCode: 404, message: "Transaksi tidak ditemukan" });
  if (tx.store.userId !== user.sub) throw createError({ statusCode: 403, message: "Akses ditolak" });
  await prisma.financeTransaction.delete({ where: { id } });
  return { success: true, message: "Transaksi berhasil dihapus" };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
