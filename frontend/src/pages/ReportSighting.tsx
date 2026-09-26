import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Navigation, Map, Edit3, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { usePublicDog } from '../hooks/useDog';
import { useSubmitSighting } from '../hooks/useSightings';
import { useLocation } from '../hooks/useLocation';
import { sightingSchema } from '../lib/validation';
import { LocationPicker } from '../components/map/LocationPicker';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SightingCondition } from '../types/sighting';

type SightingFormData = z.infer<typeof sightingSchema>;

export function ReportSighting() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const navigate = useNavigate();

  const { data: dog } = usePublicDog(qrToken || '');
  const submitSightingMutation = useSubmitSighting(qrToken || '');

  const [locationMode, setLocationMode] = useState<'GPS' | 'MAP' | 'MANUAL' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    coordinates: gpsCoordinates,
    loading: gpsLoading,
    error: gpsError,
    permissionDenied,
    requestLocation,
  } = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SightingFormData>({
    resolver: zodResolver(sightingSchema),
    defaultValues: {
      condition: 'Healthy' as SightingCondition,
      consentAgreed: false,
    },
  });

  const selectedLng = watch('longitude');
  const selectedLat = watch('latitude');

  const handleUseGps = () => {
    setLocationMode('GPS');
    requestLocation();
  };

  // Sync GPS location to form
  if (gpsCoordinates && locationMode === 'GPS' && selectedLng !== gpsCoordinates[0]) {
    setValue('longitude', gpsCoordinates[0]);
    setValue('latitude', gpsCoordinates[1]);
  }

  const handleMapSelect = (lng: number, lat: number) => {
    setValue('longitude', lng);
    setValue('latitude', lat);
  };

  const onSubmit = async (data: SightingFormData) => {
    try {
      await submitSightingMutation.mutateAsync(data);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit sighting', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back Button */}
      <Link
        to={`/d/${qrToken}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-amber-golden transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {dog?.name || 'Dog Profile'}
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">
          Where did you see {dog?.name || 'this dog'}?
        </h1>
        <p className="text-xs text-slate-500">
          PAWID: <span className="font-mono font-bold text-forest-900">{dog?.pawId || qrToken}</span>
        </p>
      </div>

      {/* Explicit Location Privacy Policy Note */}
      <Card className="p-4 bg-forest-900 text-white flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-golden shrink-0 mt-0.5" />
        <p className="text-xs text-forest-200 leading-relaxed">
          "Your location is shared only when you choose to submit this sighting."
        </p>
      </Card>

      {submitted ? (
        <Card className="p-8 text-center bg-emerald-50 border-emerald-200 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-extrabold text-emerald-900">
            Sighting Submitted!
          </h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Thank you for helping care for community animals in your area. Your voluntary report has been logged.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/d/${qrToken}`)}
            className="font-bold"
          >
            Return to Dog Profile
          </Button>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Location Mode Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
              Choose Location Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleUseGps}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  locationMode === 'GPS'
                    ? 'border-forest-900 bg-forest-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Navigation className="w-5 h-5 text-forest-800 mb-2" />
                <div>
                  <h4 className="text-xs font-bold text-forest-900">Current Location</h4>
                  <p className="text-[10px] text-slate-500">Request GPS</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocationMode('MAP')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  locationMode === 'MAP'
                    ? 'border-forest-900 bg-forest-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Map className="w-5 h-5 text-amber-golden mb-2" />
                <div>
                  <h4 className="text-xs font-bold text-forest-900">Select on Map</h4>
                  <p className="text-[10px] text-slate-500">Drop pin visually</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocationMode('MANUAL')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  locationMode === 'MANUAL'
                    ? 'border-forest-900 bg-forest-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Edit3 className="w-5 h-5 text-indigo-600 mb-2" />
                <div>
                  <h4 className="text-xs font-bold text-forest-900">Manual Entry</h4>
                  <p className="text-[10px] text-slate-500">Type area name</p>
                </div>
              </button>
            </div>
          </div>

          {/* GPS Handling Feedback */}
          {locationMode === 'GPS' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              {gpsLoading && <p className="text-forest-900 font-medium">Requesting browser location permission...</p>}
              {permissionDenied && (
                <div className="space-y-2">
                  <p className="text-rose-600 font-bold">Location permission was not provided.</p>
                  <p className="text-slate-600">Please select an alternative option below:</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setLocationMode('MAP')}>
                      Select Location on Map
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setLocationMode('MANUAL')}>
                      Enter Location Manually
                    </Button>
                  </div>
                </div>
              )}
              {gpsError && !permissionDenied && <p className="text-rose-600">{gpsError}</p>}
              {gpsCoordinates && (
                <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  GPS Location Acquired: {gpsCoordinates[1].toFixed(5)}, {gpsCoordinates[0].toFixed(5)}
                </p>
              )}
            </div>
          )}

          {/* Map Location Picker */}
          {locationMode === 'MAP' && (
            <LocationPicker
              initialCoordinates={selectedLng && selectedLat ? [selectedLng, selectedLat] : undefined}
              onSelectLocation={handleMapSelect}
            />
          )}

          {/* Manual Area Input */}
          <div className="space-y-4">
            <Input
              label="Area / Neighborhood Name"
              placeholder="e.g. Ratna Park, Kathmandu"
              {...register('areaName')}
            />

            {/* Hidden / Manual fallbacks for coords if manual entry */}
            {locationMode === 'MANUAL' && (!selectedLng || !selectedLat) && (
              <div className="text-[11px] text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-200">
                Tip: Default Kathmandu central coordinates will be linked to your manual area entry.
              </div>
            )}
          </div>

          {(errors.longitude || errors.latitude) && (
            <p className="text-xs text-rose-600 font-bold">
              Please choose a location method (GPS, Map Pin, or Manual Area).
            </p>
          )}

          {/* Condition Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
              Animal Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Healthy', 'Injured', 'Sick', 'Unknown'] as SightingCondition[]).map((cond) => (
                <label
                  key={cond}
                  className={`p-3 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                    watch('condition') === cond
                      ? 'border-forest-900 bg-forest-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-charcoal hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={cond}
                    {...register('condition')}
                    className="sr-only"
                  />
                  {cond}
                </label>
              ))}
            </div>
          </div>

          {/* Optional Photo URL */}
          <Input
            label="Photo URL (Optional)"
            placeholder="https://..."
            {...register('photoUrl')}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Dog was resting under the shop canopy..."
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
          </div>

          {/* Explicit Consent Checkbox */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentAgreed')}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-forest-900 focus:ring-forest-900"
              />
              <span className="text-xs text-charcoal font-medium leading-relaxed">
                I understand that I am voluntarily sharing this location as a community sighting.
              </span>
            </label>
            {errors.consentAgreed && (
              <p className="text-xs text-rose-600 font-bold">
                {errors.consentAgreed.message as string}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={submitSightingMutation.isPending}
            className="w-full font-bold text-base shadow-sm"
          >
            Submit Sighting
          </Button>
        </form>
      )}
    </div>
  );
}
