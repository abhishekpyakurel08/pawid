import { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface StatsCardProps {
  label: string;
  value: number | string | undefined | null;
  icon: ReactNode;
  description?: string;
}

export function StatsCard({ label, value, icon, description }: StatsCardProps) {
  const displayValue = value !== undefined && value !== null ? value : '0';

  return (
    <Card className="p-6 transition-shadow hover:shadow-md border border-forest-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-forest-50 text-forest-900">
          {icon}
        </div>
        <span className="text-3xl font-extrabold text-forest-900 tracking-tight">
          {displayValue}
        </span>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-charcoal-light">{label}</h4>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>
    </Card>
  );
}
