import { MapPin, Eye } from 'lucide-react';
import { Sighting } from '../../types/sighting';
import { formatDate } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface SightingTimelineProps {
  sightings: Sighting[];
}

export function SightingTimeline({ sightings }: SightingTimelineProps) {
  if (!sightings || sightings.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
        No community sightings reported yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative pl-6 border-l-2 border-forest-200 space-y-6">
        {sightings.map((sighting) => {
          const areaName = sighting.location.areaName || 'Community Location';
          return (
            <div key={sighting.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-forest-900 group-hover:scale-125 transition-transform"></div>

              <div className="bg-white p-4 rounded-2xl border border-forest-100/70 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-forest-700" />
                    <span className="font-bold text-forest-900 text-sm">{areaName}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {formatDate(sighting.reportedAt)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-100">
                    Condition: <strong className="text-forest-900">{sighting.condition}</strong>
                  </span>
                  <Badge variant="neutral" className="text-[10px]">
                    Community Sighting
                  </Badge>
                </div>

                {sighting.description && (
                  <p className="mt-2 text-xs text-charcoal bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{sighting.description}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
