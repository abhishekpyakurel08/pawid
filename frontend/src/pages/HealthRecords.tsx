import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { healthService } from '../services/health.service';
import { healthRecordSchema } from '../lib/validation';
import { HealthRecordType } from '../types/health';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Activity, Plus, CheckCircle2 } from 'lucide-react';
import { useDogs } from '../hooks/useDog';

type HealthRecordFormData = z.infer<typeof healthRecordSchema>;

export function HealthRecords() {
  const { data: dogData } = useDogs();
  const dogs = dogData?.dogs || [];

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthRecordFormData>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      recordType: 'Vaccination' as HealthRecordType,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: HealthRecordFormData) => {
    setIsSubmitting(true);
    try {
      await healthService.addHealthRecord(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Failed to log health record', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-teal-600" />
            Health & Veterinary Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Log anti-rabies vaccinations, spay/neuter operations, and clinical treatments.
          </p>
        </div>
      </div>

      <Card className="p-8 bg-white border border-forest-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Plus className="w-5 h-5 text-amber-golden" />
          Log New Veterinary Record
        </h2>

        {submitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Health Logged Successfully!</h3>
            <p className="text-xs text-emerald-800">
              The record has been added to the dog's veterinary medical history.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Add Another Record
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                  Select Dog *
                </label>
                <select
                  {...register('dogId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
                >
                  <option value="">Select a registered dog...</option>
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.pawId} — {dog.name || 'Unnamed'} ({dog.area})
                    </option>
                  ))}
                </select>
                {errors.dogId && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.dogId.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                  Record Type
                </label>
                <select
                  {...register('recordType')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
                >
                  <option value="Vaccination">Rabies Vaccination</option>
                  <option value="Sterilization">Sterilization (Spay/Neuter)</option>
                  <option value="Checkup">General Checkup</option>
                  <option value="Treatment">Medical Treatment</option>
                  <option value="Injury">Injury Care</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Title / Summary *"
                placeholder="e.g. Annual Anti-Rabies Vaccine"
                {...register('title')}
                error={errors.title?.message as string}
              />
              <Input
                label="Date of Service *"
                type="date"
                {...register('date')}
                error={errors.date?.message as string}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Attending Veterinarian"
                placeholder="e.g. Dr. K. Sharma, DVM"
                {...register('veterinarian')}
              />
              <Input
                label="Clinic / Organization"
                placeholder="e.g. Animal Nepal Clinic"
                {...register('clinic')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Clinical Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Administered Nobivac Rabies 1ml. Dog in good body condition."
                {...register('description')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow"
            >
              Save & Verify Health Record
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
