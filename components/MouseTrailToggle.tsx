
import React from 'react';

interface MouseTrailToggleProps {
  isActive: boolean;
  onToggle: () => void;
  isVaultMode: boolean;
}

const MouseTrailToggle: React.FC<MouseTrailToggleProps> = ({ isActive, onToggle, isVaultMode }) => {
  let buttonBgColor = '';
  let buttonHoverBgColor = '';
  let focusRingColor = '';

  if (isVaultMode) {
    buttonBgColor = isActive ? 'bg-yellow-600' : 'bg-orange-600';
    buttonHoverBgColor = isActive ? 'hover:bg-yellow-700' : 'hover:bg-orange-700';
    focusRingColor = isActive ? 'focus:ring-yellow-500' : 'focus:ring-orange-500';
  } else {
    buttonBgColor = isActive ? 'bg-red-600' : 'bg-green-600';
    buttonHoverBgColor = isActive ? 'hover:bg-red-700' : 'hover:bg-green-700';
    focusRingColor = isActive ? 'focus:ring-red-500' : 'focus:ring-green-500';
  }


  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        fixed bottom-4 right-4 z-40 
        px-4 py-2.5 rounded-lg font-semibold text-white 
        transition-all duration-300 ease-in-out shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${isVaultMode ? 'focus:ring-offset-neutral-900/70' : 'focus:ring-offset-neutral-900'}
        ${buttonBgColor} ${buttonHoverBgColor} ${focusRingColor}
      `}
      aria-pressed={isActive}
      aria-label={isActive ? "Turn off mouse trail" : "Turn on mouse trail"}
    >
      {isActive ? 'Turn Off Mouse Trail' : 'Turn On Mouse Trail'}
    </button>
  );
};

export default MouseTrailToggle;