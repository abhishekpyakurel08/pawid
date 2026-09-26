import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Eye, HeartHandshake, ShieldAlert, Camera } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Community Map', path: '/map' },
    { name: 'Dogs', path: '/dogs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo size="md" showTagline={false} />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.path)
                  ? 'text-forest-900 font-bold border-b-2 border-amber-golden pb-1'
                  : 'text-charcoal-light hover:text-forest-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dogs">
            <Button variant="secondary" size="md" className="gap-2 shadow-sm font-bold">
              <Eye className="w-4 h-4" />
              Report Sighting
            </Button>
          </Link>
          <Link to="/volunteer">
            <Button variant="outline" size="md" className="gap-2 font-bold">
              <HeartHandshake className="w-4 h-4" />
              Volunteer
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/dogs">
            <Button variant="secondary" size="sm" className="gap-1 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              Report
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-forest-900 hover:bg-forest-50 rounded-xl focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-forest-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-forest-50 text-forest-900 font-bold'
                    : 'text-charcoal-light hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/dogs" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="lg" className="w-full gap-2 justify-center font-bold">
                <Eye className="w-5 h-5" />
                Report Sighting
              </Button>
            </Link>
            <Link to="/volunteer" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="lg" className="w-full gap-2 justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
                Become a Volunteer
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-center text-slate-500 text-xs mt-2">
                <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Admin / Volunteer Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
