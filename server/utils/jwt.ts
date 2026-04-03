import { SignJWT, jwtVerify } from 'jose'

export interface JWTPayload {
  sub: string
  email: string
  role: string
}

function encodeSecret(secret: string) {
  return new TextEncoder().encode(secret)
}

function getAccessSecret() {
  const config = useRuntimeConfig()
  const secret = config.jwtSecret
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return encodeSecret(secret)
}

function getRefreshSecret() {
  const config = useRuntimeConfig()
  const secret = config.jwtRefreshSecret
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not configured')
  return encodeSecret(secret)
}

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getAccessSecret())
}

export async function signRefreshToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getRefreshSecret())
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getAccessSecret())
  return {
    sub: payload.sub as string,
    email: payload['email'] as string,
    role: payload['role'] as string,
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getRefreshSecret())
  return {
    sub: payload.sub as string,
    email: payload['email'] as string,
    role: payload['role'] as string,
  }
}
