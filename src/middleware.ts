import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  
  // Exclude API, Admin, Next.js internal, Maintenance page, and static assets
  if (
    pathName.startsWith('/api') || 
    pathName.startsWith('/admin') || 
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
