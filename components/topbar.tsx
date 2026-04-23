'use client';

import { Menu, Bell } from 'lucide-react';
import { DisplayModeToggle, type DisplayMode } from './display-mode-toggle';

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

export function Topbar({ onMenuClick, title, displayMode, onDisplayModeChange }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[var(--border-color)] bg-white/80 backdrop-blur px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold text-[var(--text-primary)] lg:text-lg">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:block">
          <DisplayModeToggle mode={displayMode} onChange={onDisplayModeChange} />
        </div>
        <button className="relative rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]" aria-label="Notifikasi">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--brand)]" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white text-xs font-bold">
          AD
        </div>
      </div>
    </header>
  );
}
