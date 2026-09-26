import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3 border-b border-forest-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-100 text-forest-900 text-xs font-bold rounded-full">
          <Shield className="w-4 h-4 text-emerald-600" />
          Transparency & Ethics
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          Privacy Policy & Location Principles
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: 25 September 2026
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-white border border-forest-100 space-y-3">
          <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-golden" />
            1. No Automatic Location Tracking
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
            Scanning a PawID QR tag with your mobile camera opens standard web profile pages (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://pawid.org/d/[qrToken]</code>). It <strong>never</strong> accesses your browser geolocation, camera background feed, or device IP location automatically.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-forest-100 space-y-3">
          <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            2. Voluntary Community Sightings
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
            When you choose to report a sighting of a community dog, you may voluntarily provide location information by clicking "Use My Current Location", picking a pin on an interactive map, or typing an area name manually. Your location is transmitted ONLY when you hit "Submit Sighting".
          </p>
        </Card>

        <Card className="p-6 bg-white border border-forest-100 space-y-3">
          <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            3. Reporter Anonymity & Protection
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
            Public users viewing a dog profile or community map will see only approximate neighborhood areas (e.g. "Ratna Park, Kathmandu"). Reporter IP addresses, device identifiers, or personal names are never displayed publicly.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-forest-100 space-y-3">
          <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            4. Verified Health Records & Moderation
          </h2>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
            Vaccination and sterilization records are logged by verified administrators and veterinarians to ensure accuracy and prevent false reporting.
          </p>
        </Card>
      </div>
    </div>
  );
}
