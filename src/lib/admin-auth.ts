/**
 * Signed admin session tokens (HMAC-SHA256, Web Crypto so it works in the proxy and in routes).
 *
 * The cookie used to be the fixed text "authenticated", which anyone could type into their
 * browser to become admin. Now the cookie is `<payload>.<signature>` and the signature can only
 * be produced by the server, which knows the secret.
 */
export const ADMIN_COOKIE = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

function getSecret(): string | null {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit && explicit.length >= 16) return explicit;
  const pw = process.env.ADMIN_PASSWORD;
  if (pw && pw.length >= 8) return `derived:${pw}`;
  // Local development only. In production with nothing configured, logins are refused.
  if (process.env.NODE_ENV !== 'production') return 'dev-only-insecure-secret';
  return null;
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(secret: string, usage: KeyUsage[]) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, usage);
}

export function isAuthConfigured(): boolean {
  return getSecret() !== null;
}

export async function createSessionToken(username: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS }))
  );
  const key = await hmacKey(secret, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
  return `${payload}.${toBase64Url(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  try {
    if (!token) return false;
    const secret = getSecret();
    if (!secret) return false;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;
    const key = await hmacKey(secret, ['verify']);
    // crypto.subtle.verify compares in constant time
    const ok = await crypto.subtle.verify('HMAC', key, fromBase64Url(sig) as BufferSource, encoder.encode(payload));
    if (!ok) return false;
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** Constant-time string comparison. */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const key = await hmacKey('compare-key-' + (getSecret() || 'x'), ['sign']);
  const [ha, hb] = await Promise.all([
    crypto.subtle.sign('HMAC', key, encoder.encode(a)),
    crypto.subtle.sign('HMAC', key, encoder.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
