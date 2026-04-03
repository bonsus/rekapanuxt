import { d as defineEventHandler, b as getCookie, c as createError, e as deleteCookie, s as setCookie } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { v as verifyRefreshToken, s as signAccessToken, a as signRefreshToken } from '../../../_/jwt.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';
import 'jose';

const refresh_post = defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");
  if (!refreshToken) {
    throw createError({ statusCode: 401, message: "No refresh token provided" });
  }
  let jwtPayload;
  try {
    jwtPayload = await verifyRefreshToken(refreshToken);
  } catch {
    deleteCookie(event, "refresh_token", { path: "/" });
    throw createError({ statusCode: 401, message: "Invalid refresh token" });
  }
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  });
  if (!storedToken || storedToken.expiresAt < /* @__PURE__ */ new Date()) {
    deleteCookie(event, "refresh_token", { path: "/" });
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {
      });
    }
    throw createError({ statusCode: 401, message: "Refresh token expired" });
  }
  if (storedToken.user.status === "INACTIVE") {
    deleteCookie(event, "refresh_token", { path: "/" });
    await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {
    });
    throw createError({ statusCode: 403, message: "Account deactivated" });
  }
  if (storedToken.user.expiredAt && storedToken.user.expiredAt < /* @__PURE__ */ new Date()) {
    deleteCookie(event, "refresh_token", { path: "/" });
    await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {
    });
    throw createError({ statusCode: 403, message: "Account expired" });
  }
  const tokenPayload = {
    sub: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role
  };
  const [newAccessToken, newRefreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload)
  ]);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: storedToken.id } }),
    prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: storedToken.userId, expiresAt }
    })
  ]);
  setCookie(event, "refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/"
  });
  return { success: true, data: { accessToken: newAccessToken } };
});

export { refresh_post as default };
//# sourceMappingURL=refresh.post.mjs.map
