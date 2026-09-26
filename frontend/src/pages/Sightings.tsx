import { useAllSightings } from '../hooks/useSightings';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Eye, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function Sightings() {
  const { data: sightings = [], isLoading } = useAllSightings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2">
            <Eye className="w-7 h-7 text-amber-golden" />
            Community Sightings Feed
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Log of all voluntary sightings reported by citizens and volunteers across Nepal.
          </p>
        </div>
      </div>

      <Card className="p-6 bg-white border border-forest-100 overflow-hidden">
        {isLoading ? (
          <LoadingState message="Fetching sightings..." />
        ) : sightings.length === 0 ? (
          <EmptyState
            icon={<Eye className="w-8 h-8 text-amber-golden" />}
            title="No Sightings Recorded"
            description="No community sightings have been logged yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Location Area</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sightings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.reportedAt)}
                    </td>
                    <td className="py-3 px-3 font-bold text-forest-900">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-golden" />
                        {item.location.areaName || 'Community Location'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={item.condition === 'Healthy' ? 'success' : 'warning'}>
                        {item.condition}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px]">{item.source}</td>
                    <td className="py-3 px-3 italic text-slate-600 max-w-xs truncate">
                      {item.description || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
