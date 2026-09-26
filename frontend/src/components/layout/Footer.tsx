import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Shield, Heart, MapPin, Mail, ExternalLink, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

// Custom TikTok Icon
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.33h.09v-3.5a6.37 6.37 0 1 0 6.25 6.34V9.67a8.28 8.28 0 0 0 4.77 1.52v-3.5a4.85 4.85 0 0 1-1-1Z" />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/pawid_org',
      icon: <Instagram className="w-4 h-4" />,
      hoverBg: 'hover:bg-pink-600',
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@pawid_org',
      icon: <TikTokIcon className="w-4 h-4" />,
      hoverBg: 'hover:bg-neutral-800',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/pawid.org',
      icon: <Facebook className="w-4 h-4" />,
      hoverBg: 'hover:bg-blue-600',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@pawid_org',
      icon: <Youtube className="w-4 h-4" />,
      hoverBg: 'hover:bg-red-600',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/pawid',
      icon: <Linkedin className="w-4 h-4" />,
      hoverBg: 'hover:bg-sky-600',
    },
  ];

  return (
    <footer className="bg-forest-950 text-white pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-forest-900/80">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="inline-block">
              <Logo size="md" variant="light" />
            </div>
            <p className="text-forest-200 text-sm leading-relaxed">
              Every Paw Has an Identity. Helping communities recognize, report, and care for street and community animals.
            </p>
            <div className="text-xs text-forest-300 flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 text-amber-golden" />
              Focus: Kathmandu Valley, Nepal
            </div>

            {/* Social Media Redirection Links */}
            <div className="pt-3">
              <h5 className="text-xs font-bold text-amber-golden uppercase tracking-wider mb-2.5">
                Connect With Us
              </h5>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow PawID on ${social.name}`}
                    className={`p-2 rounded-xl bg-forest-900 text-forest-200 ${social.hoverBg} hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-golden uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-forest-200">
              <li>
                <Link to="/dogs" className="hover:text-white transition-colors">
                  Community Dogs
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Community Map
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How PawID Works
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-white transition-colors">
                  Volunteer With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-golden uppercase tracking-wider">
              Organization
            </h4>
            <ul className="space-y-2 text-sm text-forest-200">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About PawID
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Privacy & Location Notice
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Non-Profit Statement */}
          <div className="space-y-3 bg-forest-900/60 p-5 rounded-2xl border border-forest-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-golden fill-amber-golden" />
              Nonprofit Technology
            </h4>
            <p className="text-xs text-forest-200 leading-relaxed">
              PawID is designed purely to assist animal welfare, voluntary community care, and health tracking. It is NOT a GPS tracker or pet social network.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-forest-400 gap-4">
          <p>© {new Date().getFullYear()} PawID Project. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1">
              Admin Portal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
