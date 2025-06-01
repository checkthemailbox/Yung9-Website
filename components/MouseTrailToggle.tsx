
import React from 'react';

interface MouseTrailToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const MouseTrailToggle: React.FC<MouseTrailToggleProps> = ({ isActive, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        fixed bottom-4 right-4 z-40 /* Changed to fixed and z-40 */
        px-4 py-2.5 rounded-lg font-semibold text-white 
        transition-all duration-300 ease-in-out shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900
        ${isActive 
          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        }
      `}
      aria-pressed={isActive}
      aria-label={isActive ? "Turn off mouse trail" : "Turn on mouse trail"}
    >
      {isActive ? 'Turn Off Mouse Trail' : 'Turn On Mouse Trail'}
    </button>
  );
};

export default MouseTrailToggle;
