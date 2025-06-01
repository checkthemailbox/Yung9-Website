
import React from 'react';

interface FeaturesPageProps {
  onGoBack: () => void;
  isVaultModeActive: boolean;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onGoBack, isVaultModeActive }) => {
  const titleColorClass = isVaultModeActive 
    ? 'text-red-400 [text-shadow:0_0_8px_rgba(239,68,68,0.7)]' 
    : 'text-blue-400 [text-shadow:0_0_6px_rgba(96,165,250,0.6)]';
  
  const textColorClass = isVaultModeActive 
    ? 'text-red-300/90' 
    : 'text-neutral-300';

  const buttonBaseClass = 'btn-shimmer inline-block px-8 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105';
  const buttonColorClass = isVaultModeActive 
    ? 'bg-red-600 hover:bg-red-500 focus:ring-red-400' 
    : 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-400';

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-10 sm:py-16 px-4 text-center">
      <h2 className={`text-4xl sm:text-5xl font-bold mb-6 tracking-tight ${titleColorClass}`}>
        Features
      </h2>
      <p className={`text-xl sm:text-2xl mb-10 leading-relaxed ${textColorClass}`}>
        This section is currently under construction.
      </p>
      <button
        type="button"
        onClick={onGoBack}
        className={`${buttonBaseClass} ${buttonColorClass}`}
        aria-label="Return to the main showcase"
      >
        Return to Showcase
      </button>
    </div>
  );
};

export default FeaturesPage;