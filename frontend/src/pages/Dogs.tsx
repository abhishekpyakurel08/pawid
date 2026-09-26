import { Search, Dog as DogIcon } from 'lucide-react';
import { useDogs } from '../hooks/useDog';
import { useFilterStore } from '../store/useFilterStore';
import { DogCard } from '../components/dog/DogCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Sex, DogStatus, VaccinationStatus, SterilizationStatus } from '../types/dog';

export function Dogs() {
  const {
    search,
    area,
    sex,
    status,
    vaccinationStatus,
    sterilizationStatus,
    setSearch,
    setArea,
    setSex,
    setStatus,
    setVaccinationStatus,
    setSterilizationStatus,
    resetFilters,
  } = useFilterStore();

  const { data, isLoading } = useDogs({
    search: search || undefined,
    area: area || undefined,
    sex: sex || undefined,
    status: status || undefined,
    vaccinationStatus: vaccinationStatus || undefined,
    sterilizationStatus: sterilizationStatus || undefined,
  });

  const dogs = data?.dogs || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          Community Animal Directory
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Browse registered community dogs in Nepal. Scan QR tags or view public profiles.
        </p>
      </div>

      {/* Search & Filter Bar powered by Zustand Store */}
      <div className="bg-white p-6 rounded-2xl border border-forest-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Input
              placeholder="Search by PawID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Area Filter */}
          <div>
            <Input
              placeholder="Filter by Area (e.g. Thamel)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          {/* Sex Filter */}
          <div>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as Sex | '')}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-charcoal shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-900"
            >
              <option value="">Sex: All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* Vaccination Filter */}
          <div>
            <select
              value={vaccinationStatus}
              onChange={(e) => setVaccinationStatus(e.target.value as VaccinationStatus | '')}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-charcoal shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-900"
            >
              <option value="">Vaccination: All</option>
              <option value="Vaccinated">Vaccinated</option>
              <option value="Unvaccinated">Unvaccinated</option>
            </select>
          </div>

          {/* Sterilization Filter */}
          <div>
            <select
              value={sterilizationStatus}
              onChange={(e) => setSterilizationStatus(e.target.value as SterilizationStatus | '')}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-charcoal shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-900"
            >
              <option value="">Sterilization: All</option>
              <option value="Sterilized">Sterilized</option>
              <option value="Unsterilized">Unsterilized</option>
            </select>
          </div>
        </div>

        {(search || area || sex || status || vaccinationStatus || sterilizationStatus) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filtering active results</span>
            <button
              onClick={resetFilters}
              className="text-forest-900 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <LoadingState message="Loading community dogs..." />
      ) : dogs.length === 0 ? (
        <EmptyState
          icon={<DogIcon className="w-8 h-8" />}
          title="No Community Dogs Found"
          description="We couldn't find any registered dogs matching your search or filters."
          action={
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Search Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <DogCard key={dog.id || dog.pawId} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}
