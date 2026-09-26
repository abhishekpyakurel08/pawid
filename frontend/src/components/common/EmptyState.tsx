import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl my-4">
      {icon && (
        <div className="p-4 rounded-full bg-forest-50 text-forest-800 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-forest-900 mb-1">{title}</h3>
      <p className="text-sm text-charcoal-light max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
