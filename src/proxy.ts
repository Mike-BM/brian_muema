import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth';

// GET endpoints that must only be readable by the signed-in admin
const ADMIN_ONLY_GET = ['/api/learning-hub', '/api/credentials'];

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // Public API routes that don't need auth (contact form and the login endpoint itself)
  const isPublicApi = pathName === '/api/contact' || pathName === '/api/auth';

  if (pathName.startsWith('/api') && !isPublicApi) {
    const needsAdmin =
      request.method !== 'GET' || ADMIN_ONLY_GET.some((p) => pathName === p || pathName.startsWith(p + '/'));

    if (needsAdmin) {
      // The cookie must carry a valid server-signed token. Merely having a cookie is not enough.
      const valid = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
      if (!valid) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
        });
      }
      return NextResponse.next();
    }
  }

  // Exclude API GET, Next.js internal, Maintenance page, and static assets
  if (
    pathName.startsWith('/api') || 
    pathName.startsWith('/_next') || 
    pathName.startsWith('/maintenance') ||
    pathName.match(/\.(pdf|json|ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  try {
    // We can fetch the static settings file from the origin.
    // In Edge runtime, we need the full URL to fetch.
    const settingsUrl = new URL(`/api/settings?t=${Date.now()}`, request.url);
    const res = await fetch(settingsUrl.toString(), { cache: 'no-store' });
    
    if (res.ok) {
      const settings = await res.json();
      if (settings.maintenance === true) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch(e) {
    // If fetching fails or file is missing, assume false (do not block)
    console.error("Middleware settings fetch error", e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
