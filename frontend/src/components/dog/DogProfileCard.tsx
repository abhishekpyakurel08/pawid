import { Link } from 'react-router-dom';
import { MapPin, Eye, AlertTriangle, ShieldCheck, QrCode, Calendar, Info } from 'lucide-react';
import { Dog } from '../../types/dog';
import { HealthBadge } from '../health/HealthBadge';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface DogProfileCardProps {
  dog: Dog;
  lastSightingArea?: string;
  lastSightingDate?: string;
}

export function DogProfileCard({ dog, lastSightingArea, lastSightingDate }: DogProfileCardProps) {
  const photo =
    dog.photos && dog.photos.length > 0
      ? dog.photos[0].url
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="relative h-64 sm:h-80 bg-slate-100">
        <img src={photo} alt={dog.name || dog.pawId} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="bg-forest-900/90 backdrop-blur text-amber-golden px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow">
            <QrCode className="w-4 h-4" />
            PAWID COMMUNITY ANIMAL
          </span>
          <Badge variant={dog.status === 'Active' ? 'success' : 'warning'}>
            {dog.status}
          </Badge>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-xs font-mono font-bold tracking-widest text-amber-warm uppercase">
            PAW-ID: {dog.pawId}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-0.5">
            {dog.name || 'Unnamed Community Dog'}
          </h1>
          <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-golden" />
            Registered Area: {dog.area}, Nepal
          </p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="p-6 space-y-6">
        {/* Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-forest-50/60 rounded-2xl border border-forest-100/50">
          <div>
            <span className="text-xs text-forest-700 font-semibold block">Sex</span>
            <span className="text-sm font-bold text-forest-900">{dog.sex || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-xs text-forest-700 font-semibold block">Approx Age</span>
            <span className="text-sm font-bold text-forest-900">{dog.approximateAge || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs text-forest-700 font-semibold block">Color</span>
            <span className="text-sm font-bold text-forest-900">{dog.color || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs text-forest-700 font-semibold block">Type</span>
            <span className="text-sm font-bold text-forest-900">Community Dog</span>
          </div>
        </div>

        {/* Distinctive Features */}
        {dog.distinctiveFeatures && (
          <div>
            <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
              Distinctive Markings & Features
            </h4>
            <p className="text-sm text-charcoal bg-slate-50 p-3 rounded-xl border border-slate-100">
              {dog.distinctiveFeatures}
            </p>
          </div>
        )}

        {/* Health Information */}
        <div>
          <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Health Status
          </h4>
          <div className="flex flex-wrap gap-2">
            <HealthBadge type="vaccination" status={dog.vaccinationStatus} />
            <HealthBadge type="sterilization" status={dog.sterilizationStatus} />
          </div>
        </div>

        {/* Physical Scannable QR Tag Section */}
        <div>
          <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-amber-golden" />
            Physical QR Tag Badge
          </h4>
          <QRCodeDisplay
            qrToken={dog.qrToken}
            dogName={dog.name || 'Community Dog'}
            pawId={dog.pawId}
            size={160}
          />
        </div>

        {/* Last Reported Sighting */}
        <div className="bg-amber-50/50 border border-amber-200/80 p-4 rounded-2xl">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-golden" />
            Last Reported Sighting
          </h4>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-base font-bold text-forest-900">
              {lastSightingArea || dog.lastSeenArea || dog.area}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {formatDate(lastSightingDate || dog.lastSeenDate)}
            </span>
          </div>
          <p className="text-xs text-amber-800/80 mt-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Community-reported sighting (Not live GPS tracking)
          </p>
        </div>

        {/* Actions Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link to={`/d/${dog.qrToken}/report`}>
            <Button variant="secondary" size="lg" className="w-full gap-2 font-bold text-base shadow-sm">
              <Eye className="w-5 h-5" />
              Report Sighting
            </Button>
          </Link>
          <Link to={`/d/${dog.qrToken}/report-problem`}>
            <Button variant="outline" size="lg" className="w-full gap-2 font-bold text-base border-rose-600 text-rose-700 hover:bg-rose-50">
              <AlertTriangle className="w-5 h-5" />
              Report a Problem
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
