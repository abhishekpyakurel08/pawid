import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QrCode, CheckCircle2, Download, Printer, Eye, ArrowLeft, Plus } from 'lucide-react';
import { useRegisterDog } from '../hooks/useDog';
import { dogRegistrationSchema } from '../lib/validation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LocationPicker } from '../components/map/LocationPicker';
import { Dog } from '../types/dog';
import { QRCodeDisplay } from '../components/common/QRCodeDisplay';
import { ImageUpload } from '../components/common/ImageUpload';

type RegisterDogFormData = z.infer<typeof dogRegistrationSchema>;

export function RegisterDog() {
  const navigate = useNavigate();
  const registerDogMutation = useRegisterDog();

  const [registeredDog, setRegisteredDog] = useState<Dog | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterDogFormData>({
    resolver: zodResolver(dogRegistrationSchema),
    defaultValues: {
      sex: 'Male' as const,
      status: 'Active' as const,
      vaccinationStatus: 'Unknown' as const,
      sterilizationStatus: 'Unknown' as const,
      area: 'Kathmandu',
    },
  });

  const [photoUrlInput, setPhotoUrlInput] = useState('');

  const handleLocationSelect = (lng: number, lat: number) => {
    setValue('longitude', lng);
    setValue('latitude', lat);
  };

  const onSubmit = async (data: RegisterDogFormData) => {
    const payload: Partial<Dog> = {
      name: data.name,
      sex: data.sex,
      approximateAge: data.approximateAge,
      color: data.color,
      distinctiveFeatures: data.distinctiveFeatures,
      area: data.area,
      status: data.status,
      vaccinationStatus: data.vaccinationStatus,
      sterilizationStatus: data.sterilizationStatus,
      photos: photoUrlInput ? [{ url: photoUrlInput, isPrimary: true }] : [],
      registrationLocation: data.longitude && data.latitude
        ? { type: 'Point', coordinates: [data.longitude, data.latitude] }
        : undefined,
    };

    try {
      const res = await registerDogMutation.mutateAsync(payload);
      setRegisteredDog(res);
    } catch (err) {
      console.error('Failed to register dog', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to="/dashboard/dogs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-amber-golden transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dog Directory
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          Register Community Dog
        </h1>
        <p className="text-xs text-slate-500">
          Create a new PawID digital identity and QR token.
        </p>
      </div>

      {registeredDog ? (
        <Card className="p-8 text-center bg-white border-2 border-forest-100 shadow-md space-y-6">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-full w-fit mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-golden uppercase tracking-widest">
              REGISTRATION SUCCESSFUL
            </span>
            <h2 className="text-2xl font-extrabold text-forest-900">
              {registeredDog.name || 'Community Dog'} Registered!
            </h2>
            <div className="inline-block bg-forest-900 text-white font-mono font-extrabold text-lg px-4 py-1.5 rounded-xl shadow">
              PAWID: {registeredDog.pawId}
            </div>
          </div>

          {/* Realistic Scannable QR Tag */}
          <div className="max-w-xs mx-auto">
            <QRCodeDisplay
              qrToken={registeredDog.qrToken}
              dogName={registeredDog.name || 'Community Dog'}
              pawId={registeredDog.pawId}
              size={180}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link to={`/d/${registeredDog.qrToken}`}>
              <Button variant="primary" size="md" className="w-full gap-1.5 font-bold">
                <Eye className="w-4 h-4" />
                View Profile
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="md"
              onClick={() => alert(`Downloading QR code tag for PAWID ${registeredDog.pawId}...`)}
              className="w-full gap-1.5 font-bold"
            >
              <Download className="w-4 h-4" />
              Download QR
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              className="w-full gap-1.5 font-bold"
            >
              <Printer className="w-4 h-4" />
              Print Tag
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-3xl border border-forest-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Dog Name (Optional)"
              placeholder="e.g. Rocky / Kalu"
              {...register('name')}
            />

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Sex
              </label>
              <select
                {...register('sex')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Approximate Age"
              placeholder="e.g. 2.5 years"
              {...register('approximateAge')}
            />

            <Input
              label="Coat Color"
              placeholder="e.g. Brown & White"
              {...register('color')}
            />

            <Input
              label="Area / City *"
              placeholder="e.g. Kathmandu"
              {...register('area')}
              error={errors.area?.message as string}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              Distinctive Features & Markings
            </label>
            <textarea
              rows={2}
              placeholder="e.g. White patch on left ear, black tip tail..."
              {...register('distinctiveFeatures')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Vaccination Status
              </label>
              <select
                {...register('vaccinationStatus')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              >
                <option value="Vaccinated">Vaccinated</option>
                <option value="Unvaccinated">Unvaccinated</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Sterilization Status
              </label>
              <select
                {...register('sterilizationStatus')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              >
                <option value="Sterilized">Sterilized</option>
                <option value="Unsterilized">Unsterilized</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <ImageUpload
            label="Dog Photo (Upload from Gallery or URL)"
            value={photoUrlInput}
            onChange={setPhotoUrlInput}
            maxSizeMb={4}
          />

          <div className="space-y-2">
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
              Registration Map Location (Optional Pin)
            </label>
            <LocationPicker onSelectLocation={handleLocationSelect} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={registerDogMutation.isPending}
            className="w-full font-bold text-base shadow"
          >
            Register Dog & Generate PawID
          </Button>
        </form>
      )}
    </div>
  );
}
