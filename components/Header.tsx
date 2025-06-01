
import React from 'react';

interface HeaderProps {
  onVaultClick: () => void;
  onFeaturesClick: () => void;
  vaultButtonText: string;
  isVaultOpen: boolean; 
  isVaultUnlocked: boolean;
  animateTitle: boolean;
  isVaultModeActive: boolean; 
}

const Header: React.FC<HeaderProps> = ({ 
  onVaultClick, 
  onFeaturesClick,
  vaultButtonText, 
  isVaultOpen, 
  isVaultUnlocked,
  animateTitle,
  isVaultModeActive,
}) => {
  const vaultButtonPulseClass = !isVaultUnlocked ? 'motion-safe:animate-subtle-pulse-shadow motion-reduce:animate-none' : '';
  
  let vaultButtonDynamicClass = '';
  if (isVaultModeActive) {
    vaultButtonDynamicClass = isVaultOpen 
      ? 'bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-500 text-white' 
      : 'bg-red-700 hover:bg-red-800 focus:ring-red-500 text-white shadow-[0_0_8px_1px_rgba(255,150,150,0.5)] hover:shadow-[0_0_12px_3px_rgba(255,150,150,0.7)]';
  } else {
    vaultButtonDynamicClass = !isVaultUnlocked
      ? `bg-red-600 hover:bg-red-700 focus:ring-red-400 text-white shadow-[0_0_10px_2px_rgba(220,38,38,0.6)] hover:shadow-[0_0_15px_5px_rgba(220,38,38,0.8)] ${vaultButtonPulseClass}`
      : isVaultOpen 
      ? 'bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-500 text-white' 
      : 'bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white shadow-[0_0_8px_1px_rgba(239,68,68,0.5)] hover:shadow-[0_0_12px_3px_rgba(239,68,68,0.7)]';
  }

  const featuresButtonDynamicClass = isVaultModeActive
    ? 'bg-neutral-600 hover:bg-neutral-500 focus:ring-neutral-400 text-white'
    : 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-400 text-white';

  const mainTitleColorClass = isVaultModeActive ? '' : 'text-green-300';

  return (
    <header className={`relative py-8 sm:py-10 text-center shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-80 transition-colors duration-500 ease-in-out ${isVaultModeActive ? 'header-vault-mode' : 'bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900'}`}>
      <div className="container mx-auto px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight flex justify-center items-baseline" 
        >
          <span 
            className={`${mainTitleColorClass} inline-block transition-all duration-700 ease-out motion-safe:transform motion-reduce:transition-none ${
              animateTitle ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
            style={{ transitionDelay: animateTitle ? '200ms' : '0ms' }}
          >
            Yung
          </span>
          <span 
            className={`${mainTitleColorClass} font-light inline-block transition-all duration-700 ease-out motion-safe:transform motion-reduce:transition-none ${
              animateTitle ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}
            style={{ transitionDelay: animateTitle ? '350ms' : '0ms' }}
          >
            9
          </span>
        </h1>
        <p className="mt-2 sm:mt-3 text-lg sm:text-xl"> {/* Color controlled by body's text color or parent's vault-mode class */}
          Song Showcase
        </p>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4">
          <button
            onClick={onVaultClick}
            aria-label={vaultButtonText}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${vaultButtonDynamicClass}
            `}
          >
            {vaultButtonText}
          </button>
          <button
            onClick={onFeaturesClick}
            aria-label="View Features - Work in progress"
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${featuresButtonDynamicClass}
            `}
          >
            Features
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
