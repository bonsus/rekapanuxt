import { d as defineEventHandler, r as readBody, c as createError, s as setCookie } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { p as prisma } from '../../../_/prisma.mjs';
import { s as signAccessToken, a as signRefreshToken } from '../../../_/jwt.mjs';
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

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});
const login_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error"
    });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  const dummyHash = "$2a$12$dummyhashtopreventtimingattacks00000000000000000000000000";
  const isValid = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, dummyHash).then(() => false);
  if (!user || !isValid) {
    throw createError({ statusCode: 401, message: "Invalid credentials" });
  }
  if (user.status === "INACTIVE") {
    throw createError({ statusCode: 403, message: "Your account has been deactivated. Please contact support." });
  }
  if (user.expiredAt && user.expiredAt < /* @__PURE__ */ new Date()) {
    throw createError({ statusCode: 403, message: "Your account has expired. Please contact support." });
  }
  const tokenPayload = { sub: user.id, email: user.email, role: user.role };
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload)
  ]);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt }
  });
  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/"
  });
  return {
    success: true,
    data: {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        expiredAt: user.expiredAt,
        createdAt: user.createdAt
      }
    }
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
