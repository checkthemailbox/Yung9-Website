
import { useState, useEffect } from 'react';

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Ensure window and matchMedia are available (client-side check)
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        // Media query to check if the primary input mechanism is coarse (e.g., touch)
        const PCOARSE = '(pointer:coarse)';
        const isTouchDevice = window.matchMedia(PCOARSE).matches;
        setIsMobile(isTouchDevice);
      } else {
        // Default to false if matchMedia is not available (e.g., during SSR or very old browsers)
        // For this client-rendered app, this else block is less likely to be hit.
        setIsMobile(false);
      }
    };

    checkDevice(); // Perform the check once on component mount

    // No need to listen for changes to '(pointer:coarse)' as it rarely changes dynamically during a session.
    // If resize-based mobile detection was used, a resize listener would be appropriate here.
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return isMobile;
};

export default useIsMobile;
