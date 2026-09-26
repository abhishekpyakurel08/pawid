import { useParams, Link } from 'react-router-dom';
import { usePublicDog } from '../hooks/useDog';
import { usePublicSightings } from '../hooks/useSightings';
import { DogProfileCard } from '../components/dog/DogProfileCard';
import { SightingTimeline } from '../components/sighting/SightingTimeline';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Shield, Eye, AlertTriangle, Info, QrCode, Smartphone, MapPinOff } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function DogProfile() {
  const { qrToken } = useParams<{ qrToken: string }>();

  // TanStack Query for fast cached profile & sightings retrieval
  const { data: dog, isLoading: dogLoading, isError: dogError } = usePublicDog(qrToken || '');
  const { data: sightings = [] } = usePublicSightings(qrToken || '');

  if (dogLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <LoadingState message="Instant Tag Lookup: Reading PawID profile..." />
      </div>
    );
  }

  if (dogError || !dog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          icon={<QrCode className="w-10 h-10 text-rose-500" />}
          title="Oops! We couldn't find this PawID."
          description="The QR code tag scanned may be invalid, deactivated, or not yet registered in our database."
          action={
            <Link to="/dogs">
              <Button variant="primary" size="md">
                Browse Community Dog Directory
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const latestSighting = sightings.length > 0 ? sightings[0] : undefined;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 pb-28 sm:pb-12">
      {/* Top Mobile-First Instant Scan Header */}
      <div className="bg-forest-900 text-white p-4 sm:p-5 rounded-3xl border border-forest-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-golden/20 rounded-xl text-amber-golden">
              <Smartphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-golden uppercase tracking-wider">
              Scanned via Phone Camera
            </span>
          </div>
          <span className="text-[11px] font-semibold bg-white/10 text-forest-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <MapPinOff className="w-3 h-3 text-emerald-400" />
            Zero Location Tracking
          </span>
        </div>

        <p className="text-xs text-forest-200 leading-relaxed">
          Your location is <strong>never collected</strong> just because you scanned this tag. If you choose to report a sighting, you can voluntarily share your current location, select a pin on the map, or enter a location manually.
        </p>
      </div>

      {/* Heart of the Product: Public Dog Profile Card */}
      <DogProfileCard
        dog={dog}
        lastSightingArea={latestSighting?.location?.areaName}
        lastSightingDate={latestSighting?.reportedAt}
      />

      {/* Location History Section */}
      <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-extrabold text-forest-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-golden" />
            Location History Timeline
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {sightings.length} Sightings
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Voluntary community-reported sightings for {dog.name || dog.pawId}. (Not live GPS tracking).
        </p>

        <SightingTimeline sightings={sightings} />
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur border-t border-forest-100 z-40 flex gap-2 shadow-xl">
        <Link to={`/d/${dog.qrToken}/report`} className="flex-1">
          <Button variant="secondary" size="md" className="w-full gap-1.5 font-bold shadow-md">
            <Eye className="w-4 h-4" />
            Report Sighting
          </Button>
        </Link>
        <Link to={`/d/${dog.qrToken}/report-problem`} className="flex-1">
          <Button variant="outline" size="md" className="w-full gap-1.5 font-bold border-rose-600 text-rose-700">
            <AlertTriangle className="w-4 h-4" />
            Report Problem
          </Button>
        </Link>
      </div>
    </div>
  );
}
