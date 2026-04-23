'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { getDisplayModeFromPathname, withDisplayMode } from '@/lib/display-mode-route';

interface ModeLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function ModeLink({ href, children, ...props }: ModeLinkProps) {
  const pathname = usePathname();
  const displayMode = getDisplayModeFromPathname(pathname);

  return (
    <Link {...props} href={withDisplayMode(href, displayMode)}>
      {children}
    </Link>
  );
}
