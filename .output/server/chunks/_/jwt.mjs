import { u as useRuntimeConfig } from '../nitro/nitro.mjs';
import { SignJWT, jwtVerify } from 'jose';

function encodeSecret(secret) {
  return new TextEncoder().encode(secret);
}
function getAccessSecret() {
  const config = useRuntimeConfig();
  const secret = config.jwtSecret;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return encodeSecret(secret);
}
function getRefreshSecret() {
  const config = useRuntimeConfig();
  const secret = config.jwtRefreshSecret;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not configured");
  return encodeSecret(secret);
}
async function signAccessToken(payload) {
  return new SignJWT({ email: payload.email, role: payload.role }).setProtectedHeader({ alg: "HS256" }).setSubject(payload.sub).setIssuedAt().setExpirationTime("15m").sign(getAccessSecret());
}
async function signRefreshToken(payload) {
  return new SignJWT({ email: payload.email, role: payload.role }).setProtectedHeader({ alg: "HS256" }).setSubject(payload.sub).setIssuedAt().setExpirationTime("7d").sign(getRefreshSecret());
}
async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, getAccessSecret());
  return {
    sub: payload.sub,
    email: payload["email"],
    role: payload["role"]
  };
}
async function verifyRefreshToken(token) {
  const { payload } = await jwtVerify(token, getRefreshSecret());
  return {
    sub: payload.sub,
    email: payload["email"],
    role: payload["role"]
  };
}

export { signRefreshToken as a, verifyAccessToken as b, signAccessToken as s, verifyRefreshToken as v };
//# sourceMappingURL=jwt.mjs.map
