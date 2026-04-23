'use client';

import { Monitor, Smartphone } from 'lucide-react';

export type DisplayMode = 'desktop' | 'mobile';

interface DisplayModeToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}

export function DisplayModeToggle({ mode, onChange }: DisplayModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
      <button
        type="button"
        onClick={() => onChange('desktop')}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
          mode === 'desktop'
            ? 'bg-[var(--brand)] font-semibold text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Monitor className="h-4 w-4" />
        Desktop
      </button>
      <button
        type="button"
        onClick={() => onChange('mobile')}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
          mode === 'mobile'
            ? 'bg-[var(--brand)] font-semibold text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Smartphone className="h-4 w-4" />
        Mobile
      </button>
    </div>
  );
}
