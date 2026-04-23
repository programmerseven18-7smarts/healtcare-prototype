import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_DESKTOP_PATHS = new Set(['/', '/foto', '/laporan', '/milestone', '/rsud']);
const MODE_SUFFIX_PATTERN = /\/(desktop|mobile)$/;

function isMobileRequest(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') ?? '';
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
}

function modeForRequest(request: NextRequest) {
  return isMobileRequest(request) ? 'mobile' : 'desktop';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const preferredMode = modeForRequest(request);

  if (preferredMode === 'mobile' && MODE_SUFFIX_PATTERN.test(pathname)) {
    const mobilePathname = pathname.replace(MODE_SUFFIX_PATTERN, '/mobile');
    if (mobilePathname !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = mobilePathname;
      return NextResponse.redirect(url);
    }
  }

  if (DEFAULT_DESKTOP_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${preferredMode}` : `${pathname}/${preferredMode}`;
    return NextResponse.redirect(url);
  }

  if (/^\/rsud\/[^/]+$/.test(pathname) && pathname !== '/rsud/desktop' && pathname !== '/rsud/mobile') {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/${preferredMode}`;
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
  matcher: [
    '/',
    '/desktop',
    '/mobile',
    '/foto',
    '/foto/:mode',
    '/laporan',
    '/laporan/:mode',
    '/milestone',
    '/milestone/:mode',
    '/rsud',
    '/rsud/:id',
    '/rsud/:id/:mode',
  ],
};
