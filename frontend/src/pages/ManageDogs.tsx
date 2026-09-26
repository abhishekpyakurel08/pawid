import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDogs } from '../hooks/useDog';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HealthBadge } from '../components/health/HealthBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Plus, QrCode, Eye, Edit, ShieldAlert } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function ManageDogs() {
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('');
  const { data, isLoading } = useDogs({
    search: search || undefined,
    area: area || undefined,
  });

  const dogs = data?.dogs || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
            Manage Community Dogs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered PawID profiles, status toggles, and QR codes.
          </p>
        </div>

        <Link to="/dashboard/dogs/new">
          <Button variant="primary" size="md" className="gap-2 font-bold shadow-sm">
            <Plus className="w-4 h-4" />
            Register New Dog
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-forest-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by PawID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <div className="sm:w-64">
          <Input
            placeholder="Filter Area (e.g. Kathmandu)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
      </Card>

      {/* Table Card */}
      <Card className="p-6 bg-white border border-forest-100 overflow-hidden">
        {isLoading ? (
          <LoadingState message="Fetching registered dogs..." />
        ) : dogs.length === 0 ? (
          <EmptyState
            icon={<QrCode className="w-8 h-8" />}
            title="No Dogs Found"
            description="No registered community dogs match your search criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Photo</th>
                  <th className="py-3 px-3">PawID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Area</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Vaccination</th>
                  <th className="py-3 px-3">Sterilization</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dogs.map((dog) => {
                  const photo =
                    dog.photos && dog.photos.length > 0
                      ? dog.photos[0].url
                      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80';
                  return (
                    <tr key={dog.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <img
                          src={photo}
                          alt={dog.name || dog.pawId}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-forest-900">
                        {dog.pawId}
                      </td>
                      <td className="py-3 px-3 font-bold text-charcoal">
                        {dog.name || 'Unnamed'}
                      </td>
                      <td className="py-3 px-3">{dog.area}</td>
                      <td className="py-3 px-3">
                        <Badge variant={dog.status === 'Active' ? 'success' : 'neutral'}>
                          {dog.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <HealthBadge type="vaccination" status={dog.vaccinationStatus} />
                      </td>
                      <td className="py-3 px-3">
                        <HealthBadge type="sterilization" status={dog.sterilizationStatus} />
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <Link to={`/d/${dog.qrToken}`}>
                          <Button variant="ghost" size="sm" className="p-1.5 text-slate-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/dogs/${dog.id}`}>
                          <Button variant="ghost" size="sm" className="p-1.5 text-forest-900">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
