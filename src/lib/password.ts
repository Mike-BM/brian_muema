import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

/** Passwords are stored as scrypt hashes, never as plain text. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function isHashed(stored: string): boolean {
  return stored.startsWith('scrypt$');
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!isHashed(stored)) {
    // legacy plain-text value saved by the old version: compare safely, then it gets re-hashed on next change
    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  const [, salt, hash] = stored.split('$');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
