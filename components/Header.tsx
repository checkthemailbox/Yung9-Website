
import React from 'react';
// MouseTrailToggle is no longer rendered here

interface HeaderProps {
  onVaultClick: () => void;
  vaultButtonText: string;
  isVaultOpen: boolean; 
  isVaultUnlocked: boolean;
  // isMouseTrailActive prop removed
  // onToggleMouseTrail prop removed
}

const Header: React.FC<HeaderProps> = ({ 
  onVaultClick, 
  vaultButtonText, 
  isVaultOpen, 
  isVaultUnlocked,
  // Props removed from destructuring
}) => {
  return (
    <header className="relative py-8 sm:py-10 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-center shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 tracking-tight leading-tight [text-shadow:0_0_8px_rgba(50,205,50,0.7)]"
        >
          Yung<span className="font-light">9</span>
        </h1>
        <p className="text-green-300 mt-2 sm:mt-3 text-lg sm:text-xl [text-shadow:0_0_5px_rgba(50,205,50,0.5)]">
          Song Showcase
        </p>
        <div className="mt-6">
          <button
            onClick={onVaultClick}
            aria-label={vaultButtonText}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${
                !isVaultUnlocked
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-400 shadow-[0_0_10px_2px_rgba(220,38,38,0.6)] hover:shadow-[0_0_15px_5px_rgba(220,38,38,0.8)]'
                  : isVaultOpen
                  ? 'bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-500' 
                  : 'bg-red-500 hover:bg-red-600 focus:ring-red-400 shadow-[0_0_8px_1px_rgba(239,68,68,0.5)] hover:shadow-[0_0_12px_3px_rgba(239,68,68,0.7)]'
              }
            `}
          >
            {vaultButtonText}
          </button>
        </div>
      </div>
      {/* MouseTrailToggle removed from here */}
    </header>
  );
};

export default Header;
