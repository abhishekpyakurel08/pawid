import { Link } from 'react-router-dom';
import { MapPin, Calendar, QrCode } from 'lucide-react';
import { Dog } from '../../types/dog';
import { Card } from '../ui/Card';
import { HealthBadge } from '../health/HealthBadge';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/utils';

interface DogCardProps {
  dog: Dog;
}

export function DogCard({ dog }: DogCardProps) {
  const primaryPhoto =
    dog.photos && dog.photos.length > 0
      ? dog.photos[0].url
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  return (
    <Card className="overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5 border border-forest-100 bg-white">
      {/* Image Header */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={primaryPhoto}
          alt={dog.name || dog.pawId}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant={dog.status === 'Active' ? 'success' : 'neutral'}>
            {dog.status}
          </Badge>
          <span className="bg-forest-900/80 backdrop-blur text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <QrCode className="w-3 h-3 text-amber-golden" />
            {dog.pawId}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-extrabold text-forest-900 tracking-tight">
              {dog.name || 'Unnamed Community Dog'}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-forest-50 text-forest-800 rounded-md">
              {dog.sex}
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-charcoal-light">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              <span>Area: <strong className="text-forest-900">{dog.area}</strong></span>
            </div>
            {dog.lastSeenArea && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last reported: {dog.lastSeenArea} ({formatDate(dog.lastSeenDate)})</span>
              </div>
            )}
          </div>

          {/* Health Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <HealthBadge type="vaccination" status={dog.vaccinationStatus} />
            <HealthBadge type="sterilization" status={dog.sterilizationStatus} />
          </div>
        </div>

        {/* View Profile Button */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <Link
            to={`/d/${dog.qrToken}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-forest-900 text-white rounded-xl font-bold text-xs hover:bg-forest-800 transition-colors shadow-sm text-center"
          >
            View Public Profile & Report Sighting
          </Link>
        </div>
      </div>
    </Card>
  );
}
