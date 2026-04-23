import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'amber' | 'rose';
  sub?: string;
}

const colors = {
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  green: 'bg-green-50 text-green-600 ring-green-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
};

export function StatCard({ label, value, icon: Icon, color, sub }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)] font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {sub && <p className="mt-1 text-xs text-[var(--text-muted)]">{sub}</p>}
        </div>
        <div className={cn('rounded-xl p-3 ring-1', colors[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
