import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeartHandshake, ShieldCheck, Camera, Activity, MapPin, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { volunteerApplicationSchema } from '../lib/validation';
import { Link } from 'react-router-dom';

export function Volunteer() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(volunteerApplicationSchema),
  });

  const onSubmit = async (data: any) => {
    // Simulate volunteer application submission
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    reset();
  };

  const roles = [
    {
      title: 'Dog Registration Specialist',
      desc: 'Help photograph, document, and register un-collared community dogs in your neighborhood.',
      icon: <Camera className="w-5 h-5 text-forest-900" />,
    },
    {
      title: 'Health Campaign Assistant',
      desc: 'Assist partner veterinarians during rabies vaccination drives and spay/neuter outreach.',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Sighting & Data Verifier',
      desc: 'Review public community sighting reports and verify details with local residents.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Community Outreach Ambassador',
      desc: 'Educate shopkeepers and residents on how to scan PawID tags and care for neighborhood dogs.',
      icon: <MapPin className="w-5 h-5 text-amber-golden" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-100 text-forest-900 text-xs font-bold rounded-full">
          <HeartHandshake className="w-4 h-4 text-amber-golden" />
          Join the PawID Network
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
          Help Build a Better Community for Animals.
        </h1>
        <p className="text-sm text-charcoal-light">
          Volunteers are the backbone of PawID. Become a local caretaker and help register street animals across Nepal.
        </p>
      </div>

      {/* Volunteer Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.title} className="p-6 space-y-3 bg-white border border-forest-100">
            <div className="p-3 bg-forest-50 rounded-xl w-fit">{role.icon}</div>
            <h3 className="text-lg font-bold text-forest-900">{role.title}</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">{role.desc}</p>
          </Card>
        ))}
      </div>

      {/* Application Form Card */}
      <Card className="p-8 bg-white border-2 border-forest-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-forest-900">Volunteer Application</h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill out your details below and our regional coordinator will get in touch with you.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Application Submitted!</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Thank you for volunteering with PawID! Our team will review your application and email you regarding upcoming local onboarding in your area.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-2">
              Submit Another Response
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Anish Sharma"
                {...register('fullName')}
                error={errors.fullName?.message as string}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="anish@example.com"
                {...register('email')}
                error={errors.email?.message as string}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+977 9800000000"
                {...register('phone')}
                error={errors.phone?.message as string}
              />
              <Input
                label="City / Area"
                placeholder="e.g. Kathmandu, Thamel"
                {...register('area')}
                error={errors.area?.message as string}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Role Interest
              </label>
              <select
                {...register('roleInterest')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              >
                <option value="">Select a role...</option>
                <option value="Dog Registration Specialist">Dog Registration Specialist</option>
                <option value="Health Campaign Assistant">Health Campaign Assistant</option>
                <option value="Sighting & Data Verifier">Sighting & Data Verifier</option>
                <option value="Community Outreach Ambassador">Community Outreach Ambassador</option>
              </select>
              {errors.roleInterest && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {errors.roleInterest.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                Previous Animal Care or Volunteer Experience (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Tell us a little bit about your background..."
                {...register('experience')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="font-bold">
                Become a Volunteer
              </Button>
              <Link to="/contact">
                <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto">
                  Contact PawID
                </Button>
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
