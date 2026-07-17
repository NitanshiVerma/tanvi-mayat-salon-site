// =============================================================================
// ADMIN AUTH — lightweight signed-cookie session, no external auth service.
// -----------------------------------------------------------------------------
// Requires ADMIN_PASSWORD and ADMIN_SECRET in your environment.
// The session cookie value is `<expiry>.<hmac>` — an HMAC-SHA256 of the
// expiry timestamp, signed with ADMIN_SECRET. Nothing guessable, nothing to
// store server-side. Uses the Web Crypto API (globalThis.crypto.subtle) so
// it works identically in Node.js API routes AND Edge middleware.
// Swap for NextAuth/Clerk/etc later if you need more.
// =============================================================================

const COOKIE_NAME = "salon_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not set in the environment.");
  }
  return secret;
}

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await importKey(getSecret());
  const enc = new TextEncoder();
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(sigBuf);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const signature = await sign(String(expiry));
  return `${expiry}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiryStr, signature] = token.split(".");
  if (!expiryStr || !signature) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = await sign(expiryStr);
  return timingSafeEqualStr(signature, expected);
}

export function checkPassword(candidate: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return timingSafeEqualStr(candidate, adminPassword);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
