import { Link } from 'react-router-dom';
import { QrCode, MapPin, Eye, ShieldCheck, ArrowRight, Activity, Users, Camera, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/common/StatsCard';
import { useDogStats } from '../hooks/useDog';
import { DEMO_GALLERY } from '../services/gallery.service';
import { QRCodeDisplay } from '../components/common/QRCodeDisplay';

export function Home() {
  const { data: stats } = useDogStats();
  const galleryPreviews = DEMO_GALLERY.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      {/* Enhanced Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-forest-50 via-offwhite to-offwhite border-b border-forest-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-golden animate-pulse" />
                Community Animal Identity & Welfare Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-900 tracking-tight leading-[1.12]">
                Every Paw Has an <span className="text-amber-golden underline decoration-forest-200 decoration-wavy">Identity.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-light leading-relaxed max-w-2xl">
                Helping communities recognize, care for, and protect street and community animals through digital identity, QR tag scanning, and voluntary community reporting.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/dogs">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2 font-bold shadow-md">
                    Explore PawID Directory
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dogs">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 font-bold">
                    <Eye className="w-5 h-5" />
                    Report a Sighting
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 font-bold">
                    <Camera className="w-5 h-5 text-amber-golden" />
                    Photo Gallery
                  </Button>
                </Link>
              </div>

              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-forest-800 font-semibold border-t border-forest-200/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Zero Automatic Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4.5 h-4.5 text-amber-golden" />
                  Focus: Kathmandu Valley, Nepal
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
                  100% Voluntary Care
                </span>
              </div>
            </div>

            {/* Right Hero Visual with Scan Tag Mockup & Photo Overlay */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80"
                  alt="Community dog with PawID collar tag"
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-black/20 to-transparent"></div>

                {/* Overlaid QR Tag Card Mockup */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-forest-100 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white border border-forest-900 rounded-xl shadow-sm overflow-hidden flex items-center justify-center">
                      <QRCodeDisplay
                        qrToken="demo-rocky-token-1"
                        size={48}
                        showTagCard={false}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-golden uppercase block tracking-wider">
                        PAW-NP-A8F42K (Live QR Tag)
                      </span>
                      <h4 className="text-sm font-extrabold text-forest-900">Rocky — Community Dog</h4>
                      <p className="text-[11px] text-slate-500">Kathmandu • Vaccinated & Sterilized</p>
                    </div>
                  </div>
                  <Link to="/d/demo-rocky-token-1">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3.5 py-2 rounded-full hover:bg-emerald-200 transition-colors flex items-center gap-1 shadow-sm">
                      <span>Scan Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">
            Community Impact Overview
          </h2>
          <p className="text-sm text-charcoal-light mt-2">
            Real-time verified metrics from our community-led registry in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            label="Dogs Identified"
            value={stats?.totalDogs}
            icon={<QrCode className="w-6 h-6" />}
            description="Registered with digital PawID tags"
          />
          <StatsCard
            label="Community Sightings"
            value={stats?.totalSightings}
            icon={<Eye className="w-6 h-6 text-amber-golden" />}
            description="Voluntarily reported by residents"
          />
          <StatsCard
            label="Health Records"
            value={stats?.vaccinated ? stats.vaccinated + (stats.sterilized || 0) : 0}
            icon={<Activity className="w-6 h-6 text-emerald-600" />}
            description="Vaccinations & sterilization logs"
          />
          <StatsCard
            label="Active Volunteers"
            value={stats ? 12 : 0}
            icon={<Users className="w-6 h-6 text-indigo-600" />}
            description="Helping verify & register dogs"
          />
        </div>
      </section>

      {/* How PawID Works - 4 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 border border-forest-800 shadow-xl">
          <div className="max-w-2xl mb-12">
            <span className="text-amber-golden font-bold text-xs uppercase tracking-widest">
              Simple & Voluntary
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              How PawID Works
            </h2>
            <p className="text-forest-200 text-sm mt-2">
              Empowering everyday citizens to recognize and protect community animals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 relative">
              <span className="text-4xl font-extrabold font-mono text-amber-golden/80">01</span>
              <h3 className="text-lg font-bold text-white">Identify</h3>
              <p className="text-xs text-forest-200 leading-relaxed">
                A community dog receives a durable, lightweight collar tag with a unique PawID.
              </p>
            </div>

            <div className="space-y-3 relative">
              <span className="text-4xl font-extrabold font-mono text-amber-golden/80">02</span>
              <h3 className="text-lg font-bold text-white">Scan</h3>
              <p className="text-xs text-forest-200 leading-relaxed">
                Anyone can scan the QR tag using a normal mobile phone camera without downloading an app.
              </p>
            </div>

            <div className="space-y-3 relative">
              <span className="text-4xl font-extrabold font-mono text-amber-golden/80">03</span>
              <h3 className="text-lg font-bold text-white">Report</h3>
              <p className="text-xs text-forest-200 leading-relaxed">
                People can voluntarily report where they saw the dog to update community location history.
              </p>
            </div>

            <div className="space-y-3 relative">
              <span className="text-4xl font-extrabold font-mono text-amber-golden/80">04</span>
              <h3 className="text-lg font-bold text-white">Care</h3>
              <p className="text-xs text-forest-200 leading-relaxed">
                Communities, rescuers, and vets log rabies vaccinations, sterilization, and care records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Gallery Highlights Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-golden uppercase tracking-wider">
              Community Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mt-0.5">
              Community Photo Gallery
            </h2>
          </div>
          <Link to="/gallery">
            <Button variant="outline" size="sm" className="gap-1.5 font-bold">
              <Camera className="w-4 h-4 text-amber-golden" />
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {galleryPreviews.map((photo) => (
            <Card key={photo.id} className="overflow-hidden bg-white border border-forest-100 hover:shadow-md transition-all group">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-forest-900/90 text-amber-golden font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {photo.area}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-extrabold text-forest-900 text-sm">{photo.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{photo.caption}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
