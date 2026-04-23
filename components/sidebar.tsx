'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Images,
  FileText,
  X,
  Hospital,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDisplayModeFromPathname, isPathActive, withDisplayMode } from '@/lib/display-mode-route';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rsud', label: 'Data RSUD', icon: Building2 },
  { href: '/milestone', label: 'Milestone', icon: CheckSquare },
  { href: '/foto', label: 'Foto Dokumentasi', icon: Images },
  { href: '/laporan', label: 'Laporan', icon: FileText },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'responsive' | 'drawer';
}

export function Sidebar({ open, onClose, variant = 'responsive' }: SidebarProps) {
  const pathname = usePathname();
  const displayMode = getDisplayModeFromPathname(pathname);
  const staticOnLarge = variant === 'responsive';

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className={cn('fixed inset-0 z-20 bg-foreground/20', staticOnLarge && 'lg:hidden')}
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[var(--sidebar-bg)] shadow-lg transition-transform duration-300',
          staticOnLarge && 'lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-[var(--sidebar-border)] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] shadow">
            <Hospital className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-[var(--sidebar-text)]">RSUD Monitor</p>
            <p className="text-[11px] text-[var(--sidebar-muted)]">Sistem Dokumentasi</p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'ml-auto rounded-md p-1 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)]',
              staticOnLarge && 'lg:hidden'
            )}
            aria-label="Tutup sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isPathActive(pathname, href);
            return (
              <Link
                key={href}
                href={withDisplayMode(href, displayMode)}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--brand)] text-white shadow-sm'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--brand)]'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--sidebar-border)] p-4">
          <p className="text-[11px] text-[var(--sidebar-muted)] text-center">
            v1.0.0 &bull; Kementerian Kesehatan RI
          </p>
        </div>
      </aside>
    </>
  );
}
