import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcryptjs';
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

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
const password_put = defineEventHandler(async (event) => {
  var _a, _b;
  const authPayload = await requireAuth(event);
  const body = await readBody(event);
  const parsed = UpdatePasswordSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error"
    });
  }
  const { currentPassword, newPassword } = parsed.data;
  const user = await prisma.user.findUnique({ where: { id: authPayload.sub } });
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentValid) {
    throw createError({ statusCode: 400, message: "Current password is incorrect" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
  return { success: true, message: "Password updated successfully" };
});

export { password_put as default };
//# sourceMappingURL=password.put.mjs.map
