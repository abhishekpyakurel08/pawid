import { useDogs } from '../hooks/useDog';
import { useMapSightings } from '../hooks/useSightings';
import { CommunityMap } from '../components/map/CommunityMap';
import { MapPin } from 'lucide-react';
import { Sighting } from '../types/sighting';

export function CommunityMapPage() {
  const { data: dogData } = useDogs();
  const { data: sightingData } = useMapSightings();

  const dogs = dogData?.dogs || [];

  const sightings: Sighting[] = sightingData?.features
    ? sightingData.features.map((f: any) => ({
        id: f.id || f.properties?.sightingId || Math.random().toString(),
        dogId: f.properties?.dogId || '',
        location: {
          type: 'Point' as const,
          coordinates: f.geometry?.coordinates || [85.324, 27.7172],
          areaName: f.properties?.areaName || f.properties?.locationName || 'Community Location',
        },
        condition: f.properties?.condition || 'Healthy',
        reportedAt: f.properties?.reportedAt || new Date().toISOString(),
        source: f.properties?.source || 'COMMUNITY',
      }))
    : Array.isArray(sightingData)
    ? sightingData
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-bold rounded-full mb-2 border border-amber-200">
            <MapPin className="w-3.5 h-3.5 text-amber-golden" />
            Community-Reported Sighting Map
          </div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
            Community Animal Map
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Visualizing approximate public locations of registered PawID animals and community sightings across Nepal.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-forest-100 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
            <span className="text-forest-900">Registered Dog Area</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-golden inline-block"></span>
            <span className="text-forest-900">Recent Community Sighting</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[550px] w-full rounded-3xl shadow-md border border-forest-100 overflow-hidden">
        <CommunityMap dogs={dogs} sightings={sightings} />
      </div>
    </div>
  );
}
