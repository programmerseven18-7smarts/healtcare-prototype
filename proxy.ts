import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_DESKTOP_PATHS = new Set(['/', '/foto', '/laporan', '/milestone', '/rsud']);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (DEFAULT_DESKTOP_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? '/desktop' : `${pathname}/desktop`;
    return NextResponse.redirect(url);
  }

  if (/^\/rsud\/[^/]+$/.test(pathname) && pathname !== '/rsud/desktop' && pathname !== '/rsud/mobile') {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/desktop`;
    return NextResponse.redirect(url);
  }

  if (pathname === '/rsud/desktop' || pathname === '/rsud/mobile') {
    const url = request.nextUrl.clone();
    url.pathname = '/rsud';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/foto', '/laporan', '/milestone', '/rsud', '/rsud/:id', '/rsud/desktop', '/rsud/mobile'],
};
