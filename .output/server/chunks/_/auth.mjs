import { c as createError, j as getHeader } from '../nitro/nitro.mjs';
import { b as verifyAccessToken } from './jwt.mjs';
import { p as prisma } from './prisma.mjs';

async function requireAuth(event) {
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: No token provided"
    });
  }
  const token = authHeader.slice(7);
  let payload;
  try {
    payload = await verifyAccessToken(token);
  } catch {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: Invalid or expired token"
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, status: true, expiredAt: true }
  });
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized: User no longer exists" });
  }
  if (user.status === "INACTIVE") {
    throw createError({ statusCode: 403, message: "Account has been deactivated" });
  }
  if (user.expiredAt && user.expiredAt < /* @__PURE__ */ new Date()) {
    throw createError({ statusCode: 403, message: "Account has expired" });
  }
  return payload;
}
async function requireAdmin(event) {
  const payload = await requireAuth(event);
  if (payload.role !== "ADMIN") {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Admin access required"
    });
  }
  return payload;
}

export { requireAuth as a, requireAdmin as r };
//# sourceMappingURL=auth.mjs.map
