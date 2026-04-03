import { d as defineEventHandler, g as getRouterParam, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
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

const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  expiredAt: z.string().datetime({ offset: true }).nullable().optional()
});
const _id__put = defineEventHandler(async (event) => {
  var _a, _b;
  await requireAdmin(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  const body = await readBody(event);
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error"
    });
  }
  const { name, email, password, role, status, expiredAt } = parsed.data;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw createError({ statusCode: 409, message: "Email is already in use" });
    }
  }
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (status) updateData.status = status;
  if (password) updateData.password = await bcrypt.hash(password, 12);
  if (expiredAt !== void 0) updateData.expiredAt = expiredAt ? new Date(expiredAt) : null;
  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, status: true, expiredAt: true, createdAt: true }
  });
  return { success: true, message: "User updated successfully", data: updated };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
