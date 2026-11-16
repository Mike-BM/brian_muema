import { NextResponse } from 'next/server';
import { NO_CACHE_HEADERS, jsonNoCache } from '@/lib/github';
import { ADMIN_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken, isAuthConfigured, safeEqual, verifySessionToken } from '@/lib/admin-auth';
import { readCredentials } from '@/lib/credentials';
import { verifyPassword } from '@/lib/password';
import { clientIp, rateLimit, resetRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export async function POST(request: Request) {
  try {
    const key = `login:${clientIp(request)}`;
    if (!rateLimit(key, 5, 15 * 60 * 1000)) {
      return jsonNoCache({ error: 'Too many attempts. Please wait 15 minutes and try again.' }, 429);
    }

    if (!isAuthConfigured()) {
      console.error('Admin login refused: set ADMIN_PASSWORD (and ideally ADMIN_SESSION_SECRET) in the environment.');
      return jsonNoCache({ error: 'Admin login is not configured on the server.' }, 503);
    }

    const body = await request.json().catch(() => ({}));
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!username || !password || username.length > 200 || password.length > 500) {
      return jsonNoCache({ error: 'Invalid username or password' }, 401);
    }

    const saved = await readCredentials();
    const envPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'admin123' : '');
    const envUsername = process.env.ADMIN_USERNAME || 'brian';

    const expectedUser = saved.password ? saved.username : envUsername;
    const passwordOk = saved.password
      ? verifyPassword(password, saved.password)
      : envPassword
        ? await safeEqual(password, envPassword)
        : false;
    const userOk = await safeEqual(username, expectedUser);

    if (passwordOk && userOk) {
      const token = await createSessionToken(username);
      if (!token) return jsonNoCache({ error: 'Admin login is not configured on the server.' }, 503);
      resetRateLimit(key);
      const response = NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
      response.cookies.set(ADMIN_COOKIE, token, { ...cookieOptions, maxAge: SESSION_MAX_AGE_SECONDS });
      return response;
    }
    return jsonNoCache({ error: 'Invalid username or password' }, 401);
  } catch (error) {
    console.error('Login error:', error);
    return jsonNoCache({ error: 'Internal server error' }, 500);
  }
}

export async function GET(request: Request) {
  const match = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  const authenticated = await verifySessionToken(match ? decodeURIComponent(match[1]) : null);
  return jsonNoCache({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  response.cookies.set(ADMIN_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  // also clear the old forgeable cookie if a browser still has it
  response.cookies.set('admin_token', '', { ...cookieOptions, maxAge: 0 });
  return response;
}
