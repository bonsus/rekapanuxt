import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../../_/auth.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../../../_/jwt.mjs';
import 'jose';
import '@prisma/client';

const _id__delete = defineEventHandler(async (event) => {
  const adminPayload = await requireAdmin(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  if (id === adminPayload.sub) {
    throw createError({ statusCode: 400, message: "You cannot delete your own account" });
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  await prisma.user.delete({ where: { id } });
  return { success: true, message: "User deleted successfully" };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
