import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

export function Logo({
  size = 'md',
  showTagline = false,
  variant = 'dark',
  className = '',
}: LogoProps) {
  const imageSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const isLightMode = variant === 'light';

  return (
    <Link to="/" className={`inline-flex flex-col focus:outline-none group ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="relative rounded-full p-0.5 bg-white shadow-sm group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="PAWID — Digital Pet ID & Contact"
            className={`${imageSizes[size]} object-contain rounded-full`}
          />
        </div>
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight leading-none ${
              isLightMode ? 'text-white' : 'text-forest-900'
            } ${textSizes[size]}`}
          >
            PAW<span className="text-amber-golden">ID</span>
          </span>
          <span
            className={`text-[10px] font-bold tracking-wider uppercase mt-0.5 ${
              isLightMode ? 'text-emerald-300' : 'text-emerald-800'
            }`}
          >
            Digital Identity
          </span>
        </div>
      </div>
      {showTagline && (
        <span
          className={`text-xs font-semibold tracking-wide mt-1 ${
            isLightMode ? 'text-forest-200' : 'text-forest-800'
          }`}
        >
          Every Paw Has an Identity.
        </span>
      )}
    </Link>
  );
}
