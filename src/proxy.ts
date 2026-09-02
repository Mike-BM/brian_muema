import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  
  // Exclude public API routes that don't need auth
  const isPublicApi = pathName === '/api/contact' || pathName === '/api/auth';
  
  // Authentication for protected API routes
  if (pathName.startsWith('/api') && request.method !== 'GET' && !isPublicApi) {
    const hasAdminToken = request.cookies.has('admin_token');
    
    if (hasAdminToken) {
      return NextResponse.next();
    }

    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
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
    const settingsUrl = new URL('/data/settings.json', request.url);
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
