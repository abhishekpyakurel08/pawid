import { Shield, MapPin, Heart, QrCode, Lock, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 text-amber-golden" />
          About PawID Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-900 tracking-tight">
          Every Paw Has an Identity.
        </h1>
        <p className="text-base sm:text-lg text-charcoal-light max-w-2xl mx-auto">
          PawID is a nonprofit digital identity and community-care initiative for street and community animals.
        </p>
      </div>

      {/* Main Mission Card */}
      <Card className="p-8 space-y-6 bg-white border-2 border-forest-100 shadow-sm">
        <h2 className="text-2xl font-bold text-forest-900">Why PawID Exists</h2>
        <p className="text-sm text-charcoal leading-relaxed">
          In cities across Nepal and beyond, millions of community animals live alongside human residents. Many are loved and cared for by local neighborhoods, but lack a recognized identity. When an animal is vaccinated against rabies, sterilized, or in need of medical help, there is rarely a centralized system to verify their history.
        </p>
        <p className="text-sm text-charcoal leading-relaxed">
          PawID bridges this gap by assigning each community dog a unique digital identity (PAWID) paired with a comfortable, lightweight QR collar tag.
        </p>

        {/* Highlight Banner */}
        <div className="bg-forest-900 text-white p-5 rounded-2xl flex items-start gap-4">
          <Shield className="w-6 h-6 text-amber-golden shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Core Governance Principle</h4>
            <p className="text-xs text-forest-200 mt-1 leading-relaxed">
              "PawID is designed to help communities care for animals—not to monitor people."
            </p>
          </div>
        </div>
      </Card>

      {/* The Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 bg-amber-50/50 border-amber-200">
          <h3 className="text-lg font-bold text-amber-900">The Problem</h3>
          <ul className="text-xs text-amber-950 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Unidentified street animals repeat vaccination cycles unnecessarily.</li>
            <li>Lack of transparent health records makes rabies management difficult.</li>
            <li>No quick way for residents to report injured or sick community animals.</li>
            <li>Misunderstandings lead to fear or conflict between residents and animals.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3 bg-emerald-50/50 border-emerald-200">
          <h3 className="text-lg font-bold text-emerald-900">The PawID Solution</h3>
          <ul className="text-xs text-emerald-950 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Instant mobile QR scanning with zero app installation required.</li>
            <li>Public health badge showing vaccination and sterilization status.</li>
            <li>Voluntary sighting reports to maintain community location history.</li>
            <li>Fosters neighborhood pride and collective care for street animals.</li>
          </ul>
        </Card>
      </div>

      {/* Privacy Principles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-forest-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-golden" />
          Our Privacy & Ethical Standards
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-forest-100">
            <h4 className="font-bold text-sm text-forest-900">Zero Automatic Tracking</h4>
            <p className="text-xs text-slate-500 mt-1">
              Scanning a tag NEVER collects your location or IP address automatically.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-forest-100">
            <h4 className="font-bold text-sm text-forest-900">Voluntary Sighting</h4>
            <p className="text-xs text-slate-500 mt-1">
              Location is shared only when you explicitly submit a sighting report.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-forest-100">
            <h4 className="font-bold text-sm text-forest-900">No Citizen Profiling</h4>
            <p className="text-xs text-slate-500 mt-1">
              Reporter identity is confidential and never displayed publicly.
            </p>
          </div>
        </div>
      </div>

      {/* Future Vision */}
      <Card className="p-8 bg-forest-50 border-forest-200 text-center space-y-4">
        <Globe className="w-8 h-8 text-forest-800 mx-auto" />
        <h3 className="text-xl font-bold text-forest-900">Initial Focus & Future Vision</h3>
        <p className="text-xs sm:text-sm text-charcoal max-w-xl mx-auto leading-relaxed">
          PawID starts with community and street dogs in Kathmandu Valley, Nepal, with plans to expand to cats, municipal sterilization campaigns, and animal welfare organizations globally.
        </p>
      </Card>
    </div>
  );
}
