import { useParams, Link } from 'react-router-dom';
import { useDogDetails } from '../hooks/useDog';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { HealthBadge } from '../components/health/HealthBadge';
import { Badge } from '../components/ui/Badge';
import { QrCode, ArrowLeft, Shield, Eye, Activity, Edit, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function DogDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: dog, isLoading, isError } = useDogDetails(id || '');

  if (isLoading) return <LoadingState message="Fetching dog admin records..." />;
  if (isError || !dog) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          title="Dog Record Not Found"
          description="The requested dog record ID does not exist in the administrative database."
          action={
            <Link to="/dashboard/dogs">
              <Button variant="primary" size="sm">Return to Dogs List</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const primaryPhoto =
    dog.photos && dog.photos.length > 0
      ? dog.photos[0].url
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to="/dashboard/dogs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-amber-golden transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dog Directory
      </Link>

      {/* Header Info Banner */}
      <Card className="p-6 bg-white border border-forest-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={primaryPhoto}
            alt={dog.name || dog.pawId}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-forest-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-forest-900 text-amber-golden font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-md">
                PAWID: {dog.pawId}
              </span>
              <Badge variant={dog.status === 'Active' ? 'success' : 'neutral'}>
                {dog.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-forest-900 mt-1">
              {dog.name || 'Unnamed Dog'}
            </h1>
            <p className="text-xs text-slate-500">
              Registered Area: {dog.area} • Registered on {formatDate(dog.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={`/d/${dog.qrToken}`}>
            <Button variant="outline" size="sm" className="gap-1.5 font-bold">
              <Eye className="w-3.5 h-3.5" />
              Public View
            </Button>
          </Link>
          <Link to="/dashboard/health-records">
            <Button variant="secondary" size="sm" className="gap-1.5 font-bold">
              <Activity className="w-3.5 h-3.5" />
              Add Health Log
            </Button>
          </Link>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Specs */}
        <Card className="p-6 bg-white border border-forest-100 space-y-4">
          <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Physical Attributes
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Sex:</span>
              <strong className="text-forest-900">{dog.sex}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Approximate Age:</span>
              <strong className="text-forest-900">{dog.approximateAge || 'N/A'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Coat Color:</span>
              <strong className="text-forest-900">{dog.color || 'N/A'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vaccination:</span>
              <HealthBadge type="vaccination" status={dog.vaccinationStatus} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sterilization:</span>
              <HealthBadge type="sterilization" status={dog.sterilizationStatus} />
            </div>
          </div>
        </Card>

        {/* Right Column: QR Tag details */}
        <Card className="md:col-span-2 p-6 bg-white border border-forest-100 space-y-4">
          <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>QR Digital Token Details</span>
            <QrCode className="w-4 h-4 text-amber-golden" />
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-24 h-24 bg-white border border-forest-900 p-2 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-20 h-20 text-forest-900" />
            </div>
            <div className="space-y-1.5 text-xs text-center sm:text-left">
              <p className="font-mono text-slate-500">Token ID: {dog.qrToken}</p>
              <p className="font-mono text-forest-900 font-bold">
                https://pawid.org/d/{dog.qrToken}
              </p>
              <div className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`QR Token regenerated for ${dog.pawId}`)}
                  className="gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate Token
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
