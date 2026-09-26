import { QrCode, Scan, MapPin, ShieldCheck, Heart, FileCheck, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function HowItWorks() {
  const stages = [
    {
      step: '01',
      title: 'Community Dog Registration',
      desc: 'Authorized volunteers and local rescuers catalog the dog with physical descriptions, photos, approximate age, and area location.',
      icon: <Users className="w-6 h-6 text-forest-800" />,
    },
    {
      step: '02',
      title: 'PawID Generation',
      desc: 'The system generates a unique identifier (e.g. PAW-NP-A8F42K) and cryptographic QR token linked to the dog profile.',
      icon: <QrCode className="w-6 h-6 text-amber-golden" />,
    },
    {
      step: '03',
      title: 'QR Tag Attachment',
      desc: 'A lightweight, weatherproof QR tag is attached to a comfortable break-away safety collar on the dog.',
      icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '04',
      title: 'Public Scanning',
      desc: 'Any citizen or tourist who sees the dog can scan the QR code using any smartphone camera. No app download is required.',
      icon: <Scan className="w-6 h-6 text-indigo-600" />,
    },
    {
      step: '05',
      title: 'Voluntary Sightings',
      desc: 'Scanners can voluntarily report where they saw the dog, helping build a neighborhood location history timeline.',
      icon: <MapPin className="w-6 h-6 text-rose-600" />,
    },
    {
      step: '06',
      title: 'Verified Health Logging',
      desc: 'Partner veterinarians log rabies vaccinations, sterilizations, medical treatments, and health updates.',
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
    },
    {
      step: '07',
      title: 'Community Care & Protection',
      desc: 'Equipped with transparent information, local communities care for, feed, and protect their street animals with peace of mind.',
      icon: <Heart className="w-6 h-6 text-amber-golden" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-golden uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Step-by-Step Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
          How PawID Works
        </h1>
        <p className="text-sm text-charcoal-light">
          A seamless community ecosystem connecting technology with everyday compassionate animal care.
        </p>
      </div>

      {/* 7-Stage Workflow Grid */}
      <div className="space-y-6">
        {stages.map((stage, idx) => (
          <Card
            key={stage.step}
            className="p-6 transition-all hover:border-forest-300 flex flex-col sm:flex-row items-start gap-6 bg-white"
          >
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-3xl font-extrabold font-mono text-amber-golden/90">
                {stage.step}
              </span>
              <div className="p-3 bg-forest-50 rounded-2xl border border-forest-100">
                {stage.icon}
              </div>
            </div>

            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-forest-900">{stage.title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                {stage.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
