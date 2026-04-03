import { d as defineEventHandler, b as getCookie, e as deleteCookie } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const logout_post = defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } }).catch(() => {
    });
  }
  deleteCookie(event, "refresh_token", { path: "/" });
  return { success: true, message: "Logged out successfully" };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
