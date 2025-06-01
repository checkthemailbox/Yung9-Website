
import React, { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  isVaultModeActive: boolean;
  className?: string; // Added to allow passing custom classes
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, isVaultModeActive, className }) => {
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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; 

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, isClient, targetDate]); 

  const titleGlowClass = isVaultModeActive 
    ? 'motion-safe:animate-pulse-glow-red motion-reduce:animate-none text-red-400' 
    : 'motion-safe:animate-pulse-glow-green motion-reduce:animate-none text-yellow-400';
  
  const numberColorClass = isVaultModeActive ? 'text-red-400' : 'text-green-400';
  const labelColorClass = isVaultModeActive ? 'text-red-300/80' : 'text-neutral-400';
  const colonColorClass = isVaultModeActive ? 'text-red-500/70' : 'text-neutral-500';
  const albumOutTextColor = isVaultModeActive ? 'text-red-400 [text-shadow:0_0_8px_rgba(239,68,68,0.7)]' : 'text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.7)]';


  if (!isClient) {
    // Simplified SSR/initial render state, colors will adapt once client loads
    return (
      <div className={`text-center py-6 sm:py-8 shadow-md transition-colors duration-500 ease-in-out ${isVaultModeActive ? 'countdown-timer-vault-mode' : 'bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800'} ${className || ''}`}>
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-3 ${titleGlowClass}`}>
          ALBUM JUNE 30TH
        </h2>
        <div className="text-xl sm:text-2xl font-mono">
          Loading countdown...
        </div>
      </div>
    );
  }


  const timerComponents: JSX.Element[] = [];

  if (timeLeft) {
    Object.keys(timeLeft).forEach((interval) => {
      const value = timeLeft[interval as keyof TimeLeft];
      if (value < 0) return; 

      timerComponents.push(
        <span key={interval} className="mx-1 sm:mx-2">
          <span className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${numberColorClass}`}>
            {String(value).padStart(2, '0')}
          </span>
          <span className={`text-xs sm:text-sm ml-1 ${labelColorClass}`}>
            {interval.charAt(0).toUpperCase() + interval.slice(1)}
          </span>
        </span>
      );
    });
  }

  return (
    <div className={`text-center py-6 sm:py-8 shadow-md transition-colors duration-500 ease-in-out ${isVaultModeActive ? 'countdown-timer-vault-mode' : 'bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800'} ${className || ''}`}>
      <h2 
        className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 ${titleGlowClass}`}
        aria-live="polite"
      >
        ALBUM JUNE 30TH
      </h2>
      <div 
        key={timeLeft ? 'counting' : 'finished'} 
        className="transition-opacity duration-500 ease-in-out motion-reduce:transition-none"
        role="timer" 
        aria-atomic="true"
      >
        {timerComponents.length ? (
          <div className={`text-xl sm:text-2xl font-mono tabular-nums ${isVaultModeActive ? 'text-red-200' : 'text-neutral-300'}`}>
            {timerComponents.reduce((prev, curr, index) => (
              <>
                {prev}
                {index > 0 && <span className={`${colonColorClass} mx-0.5 sm:mx-1`}>:</span>}
                {curr}
              </>
            ), <></>)}
          </div>
        ) : (
          <p className={`text-2xl sm:text-3xl font-bold ${albumOutTextColor}`} aria-live="polite">
            ALBUM OUT NOW!
          </p>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;