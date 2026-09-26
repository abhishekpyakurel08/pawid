import { ShieldCheck, ShieldAlert, HelpCircle } from 'lucide-react';
import { VaccinationStatus, SterilizationStatus } from '../../types/dog';

interface HealthBadgeProps {
  type: 'vaccination' | 'sterilization';
  status: VaccinationStatus | SterilizationStatus;
}

export function HealthBadge({ type, status }: HealthBadgeProps) {
  const isVaccinated = status === 'Vaccinated';
  const isSterilized = status === 'Sterilized';
  const isUnknown = status === 'Unknown';

  const label =
    type === 'vaccination'
      ? isVaccinated
        ? 'Vaccinated'
        : status === 'Unvaccinated'
        ? 'Not Vaccinated'
        : 'Vaccination Unknown'
      : isSterilized
      ? 'Sterilized'
      : status === 'Unsterilized'
      ? 'Not Sterilized'
      : 'Sterilization Unknown';

  const badgeStyles =
    isVaccinated || isSterilized
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : isUnknown
      ? 'bg-slate-50 text-slate-600 border-slate-200'
      : 'bg-amber-50 text-amber-800 border-amber-200';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles}`}
    >
      {isVaccinated || isSterilized ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      ) : isUnknown ? (
        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
      ) : (
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
      )}
      <span>{label}</span>
    </div>
  );
}
