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

const me_get = defineEventHandler(async (event) => {
  const payload = await requireAuth(event);
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  return { success: true, data: { user } };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
