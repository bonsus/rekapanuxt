import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { r as requireAdmin } from '../../../_/auth.mjs';
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

const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  expiredAt: z.string().datetime({ offset: true }).nullable().optional()
});
const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  await requireAdmin(event);
  const body = await readBody(event);
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error"
    });
  }
  const { name, email, password, role, status, expiredAt } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createError({ statusCode: 409, message: "Email is already in use" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      status,
      expiredAt: expiredAt ? new Date(expiredAt) : null
    },
    select: { id: true, name: true, email: true, role: true, status: true, expiredAt: true, createdAt: true }
  });
  return { success: true, message: "User created successfully", data: user };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
