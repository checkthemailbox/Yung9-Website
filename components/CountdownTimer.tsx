
import React, { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft | null = null;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only runs its timer logic on the client-side
    // to prevent hydration mismatches with server-rendered initial state (if any).
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run timer logic on server or before client hydration

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, isClient, targetDate]); // Rerun effect if targetDate changes (though unlikely here)

  if (!isClient) {
    // Render a placeholder or null on the server/initial render to avoid mismatches
    // Or a static "Loading countdown..."
    return (
      <div className="text-center py-6 sm:py-8 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight [text-shadow:0_0_8px_rgba(250,204,21,0.7)] mb-3">
          ALBUM JUNE 30TH
        </h2>
        <div className="text-xl sm:text-2xl text-neutral-300 font-mono">
          Loading countdown...
        </div>
      </div>
    );
  }


  const timerComponents: JSX.Element[] = [];

  if (timeLeft) {
    Object.keys(timeLeft).forEach((interval) => {
      const value = timeLeft[interval as keyof TimeLeft];
      if (value < 0) return; // Should not happen if timeLeft is null when difference <=0

      timerComponents.push(
        <span key={interval} className="mx-1 sm:mx-2">
          <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-400">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm text-neutral-400 ml-1">
            {interval.charAt(0).toUpperCase() + interval.slice(1)}
          </span>
        </span>
      );
    });
  }

  return (
    <div className="text-center py-6 sm:py-8 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-md">
      <h2 
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 tracking-tight mb-3 sm:mb-4 [text-shadow:0_0_10px_rgba(250,204,21,0.8)]"
        aria-live="polite" // Announce changes for screen readers
      >
        ALBUM JUNE 30TH
      </h2>
      {timerComponents.length ? (
        <div className="text-xl sm:text-2xl text-neutral-300 font-mono tabular-nums" role="timer" aria-atomic="true">
          {timerComponents.reduce((prev, curr, index) => (
            <>
              {prev}
              {index > 0 && <span className="text-neutral-500 mx-0.5 sm:mx-1">:</span>}
              {curr}
            </>
          ), <></>)}
        </div>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.7)]" aria-live="polite">
          ALBUM OUT NOW!
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
