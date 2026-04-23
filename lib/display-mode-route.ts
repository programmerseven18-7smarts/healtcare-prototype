import type { DisplayMode } from '@/components/display-mode-toggle';

const MODE_SEGMENTS: DisplayMode[] = ['desktop', 'mobile'];

export function getDisplayModeFromPathname(pathname: string): DisplayMode {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.at(-1);
  return lastSegment === 'mobile' ? 'mobile' : 'desktop';
}

export function stripDisplayModeSuffix(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.at(-1);

  if (lastSegment && MODE_SEGMENTS.includes(lastSegment as DisplayMode)) {
    segments.pop();
  }

  return segments.length > 0 ? `/${segments.join('/')}` : '/';
}

export function withDisplayMode(pathname: string, mode: DisplayMode) {
  const basePath = stripDisplayModeSuffix(pathname);
  return basePath === '/' ? `/${mode}` : `${basePath}/${mode}`;
}

export function isPathActive(pathname: string, href: string) {
  const cleanPathname = stripDisplayModeSuffix(pathname);
  return cleanPathname === href || (href !== '/' && cleanPathname.startsWith(href));
}
