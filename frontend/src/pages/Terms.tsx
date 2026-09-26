import { FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3 border-b border-forest-100 pb-6">
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2">
          <FileText className="w-8 h-8 text-amber-golden" />
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: 25 September 2026
        </p>
      </div>

      <Card className="p-6 bg-white border border-forest-100 space-y-4 text-xs sm:text-sm text-charcoal leading-relaxed">
        <h2 className="text-base font-bold text-forest-900">1. Nonprofit Platform Purpose</h2>
        <p>
          PawID is a community-care tool designed to assist in recognizing street and community animals, recording rabies vaccinations, and logging voluntary sightings. It is provided "as-is" for humane community welfare.
        </p>

        <h2 className="text-base font-bold text-forest-900">2. Responsible Voluntary Reporting</h2>
        <p>
          Users submitting sighting or problem reports agree to provide truthful, respectful information to the best of their knowledge. Submitting false reports or abusive media is strictly prohibited.
        </p>

        <h2 className="text-base font-bold text-forest-900">3. Non-Emergency Disclaimer</h2>
        <p>
          PawID is NOT an emergency dispatch or rapid veterinary rescue service. If an animal requires urgent life-saving care, please contact your nearest local emergency veterinary clinic directly.
        </p>
      </Card>
    </div>
  );
}
