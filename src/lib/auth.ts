import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "junto_ops_session";
const SESSION_EXPIRATION = "7d";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "junto-fallback-super-secure-session-key-32chars";
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32));
}

export interface SessionPayload {
  authenticated: boolean;
  role: "ops_admin";
  issuedAt: number;
}

/**
 * Creates an encrypted JWT session token for authenticated operations staff.
 */
export async function createSessionToken(): Promise<string> {
  const key = getSecretKey();
  const token = await new SignJWT({
    authenticated: true,
    role: "ops_admin",
    issuedAt: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(key);

  return token;
}

/**
 * Verifies an incoming session token and returns the payload if valid.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    if (payload && payload.authenticated === true) {
      return payload as unknown as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}
