import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { usePublicDog } from '../hooks/useDog';
import { reportService } from '../services/report.service';
import { reportProblemSchema } from '../lib/validation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProblemType } from '../types/report';

type ReportProblemFormData = z.infer<typeof reportProblemSchema>;

export function ReportProblem() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const navigate = useNavigate();
  const { data: dog } = usePublicDog(qrToken || '');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemOptions: { label: string; value: ProblemType }[] = [
    { label: 'Dog appears injured', value: 'Injured' },
    { label: 'Dog appears sick', value: 'Sick' },
    { label: 'Dog may be missing', value: 'Missing' },
    { label: 'Dog may have died', value: 'Deceased' },
    { label: 'Possible abuse', value: 'Abuse' },
    { label: 'Wrong information on profile', value: 'WrongInfo' },
    { label: 'Other problem', value: 'Other' },
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportProblemFormData>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: {
      problemType: 'Injured' as ProblemType,
      description: '',
    },
  });

  const onSubmit = async (data: ReportProblemFormData) => {
    setIsSubmitting(true);
    try {
      await reportService.submitReportByQr(qrToken || '', data);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit report', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        to={`/d/${qrToken}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-amber-golden transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {dog?.name || 'Dog Profile'}
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-rose-600" />
          Report a Problem for {dog?.name || 'this Dog'}
        </h1>
        <p className="text-xs text-slate-500">
          PAWID: <span className="font-mono font-bold text-forest-900">{dog?.pawId || qrToken}</span>
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 text-center bg-rose-50 border-rose-200 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-extrabold text-rose-950">
            Problem Report Submitted
          </h2>
          <p className="text-xs text-rose-800 max-w-md mx-auto">
            Thank you for bringing this issue to our attention. Our volunteer coordinators and partner welfare groups have received your report.
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-3xl border border-forest-100 shadow-sm">
          {/* Problem Type Options */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
              Select Problem Category
            </label>
            <div className="space-y-2">
              {problemOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    watch('problemType') === opt.value
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold'
                      : 'border-slate-200 bg-white text-charcoal hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('problemType')}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Name */}
          <Input
            label="Location / Area Name"
            placeholder="e.g. Near New Road Gate, Kathmandu"
            {...register('locationName')}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              Detailed Description of the Issue *
            </label>
            <textarea
              rows={4}
              placeholder="Describe what you observed so our team can assess urgent care needs..."
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* Optional Photo URL */}
          <Input
            label="Photo URL (Optional)"
            placeholder="https://..."
            {...register('photoUrl')}
          />

          <Button
            type="submit"
            variant="danger"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold text-base shadow-sm"
          >
            Submit Problem Report
          </Button>
        </form>
      )}
    </div>
  );
}
