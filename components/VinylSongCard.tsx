
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Song } from '../types.ts';

// SVG Icons for Controls
const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
  </svg>
);

const Rewind5sIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const Forward5sIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.977 9.348h-4.992v-.001M21.015 19.644v-4.992m0 0h-4.992m4.993 0-3.181 3.183a8.25 8.25 0 0 1-13.803-3.7M19.969 9.865a8.25 8.25 0 0 0-13.803-3.7l-3.181 3.182m0-4.991v4.99" />
  </svg>
);

const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

interface VinylSongCardProps {
  song: Song;
  onPlay: (songId: string) => void;
  currentlyPlayingId: string | null;
}

const VinylSongCard: React.FC<VinylSongCardProps> = ({ song, onPlay, currentlyPlayingId }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleAudioPlay = useCallback(() => {
    setIsPlaying(true);
    onPlay(song.id);
  }, [onPlay, song.id]);

  const handleAudioPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    const audio = audioRef.current;
    if (audio && audio.duration && audio.duration !== Infinity) {
      setCurrentTime(audio.duration);
    }
  }, []);
  
  const handleAudioError = useCallback((e: Event) => {
    const mediaError = (e.target as HTMLAudioElement)?.error;
    let errorMessage = 'Unknown audio error';
    if (mediaError) {
      switch (mediaError.code) {
        case MediaError.MEDIA_ERR_ABORTED: errorMessage = 'Audio fetch aborted by user.'; break;
        case MediaError.MEDIA_ERR_NETWORK: errorMessage = 'A network error caused the audio download to fail.'; break;
        case MediaError.MEDIA_ERR_DECODE: errorMessage = 'Audio playback aborted due to a corruption problem or features not supported by browser.'; break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMessage = 'Audio source not supported. (Often a CORS issue or invalid URL)'; break;
        default: errorMessage = `An unknown error occurred. Code: ${mediaError.code}`;
      }
    }
    console.error(`[VinylSongCard - ${song.title}] Audio error: ${errorMessage}`, mediaError);
    setIsPlaying(false);
  }, [song.title]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
        if (audio.duration !== Infinity && audio.duration > 0) {
             setDuration(audio.duration);
        } else {
             setTimeout(() => {
                 if (audio.duration !== Infinity && audio.duration > 0) {
                     setDuration(audio.duration);
                 }
             }, 500); // Delay check for browsers that take time to report duration
        }
    }
    
    const onTimeUpdateInternal = () => {
      if (audio && !audio.paused) { // only update if playing
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdateInternal);
    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('error', handleAudioError);
    audio.preload = 'metadata';
    
    setDuration(0); // Reset duration on src change
    setCurrentTime(0); // Reset current time on src change
    setIsPlaying(false); // Reset playing state on src change
   
    // Ensure audio source is updated if it changes
    if (audio.currentSrc !== song.audioSnippetUrl || audio.src !== song.audioSnippetUrl) { 
        audio.src = song.audioSnippetUrl; 
        audio.load(); // Important: call load() after changing src
    } else if (audio.readyState === 0) { // If src is same but not loaded (e.g. network error previously)
        audio.load();
    }


    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdateInternal);
      audio.removeEventListener('play', handleAudioPlay);
      audio.removeEventListener('pause', handleAudioPause);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.removeEventListener('error', handleAudioError);
      if (audio && !audio.paused) { // Cleanup: pause audio if component unmounts while playing
        audio.pause();
      }
    };
  }, [song.audioSnippetUrl, song.title, handleAudioPlay, handleAudioPause, handleAudioEnded, handleAudioError]);

  // Effect to pause this card's audio if another card starts playing
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentlyPlayingId && currentlyPlayingId !== song.id && !audio.paused) {
      audio.pause();
    }
  }, [currentlyPlayingId, song.id]);


  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(error => {
        console.error(`[VinylSongCard - ${song.title}] Error playing audio:`, error);
        // setIsPlaying(false); // Error handler and pause event will manage state
      });
    } else { 
      audio.pause();
    }
  }, [song.title]);

  const seek = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;
    const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
    audio.currentTime = newTime;
    setCurrentTime(newTime); 
  }, []);

  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || isNaN(audio.duration) || audio.duration === 0) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);
  
  const handleCardKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPanelVisible(prev => !prev);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const displayArtist = song.featuredArtist 
    ? `${song.artist} (feat. ${song.featuredArtist})` 
    : song.artist;

  return (
    <div
      className="group relative flex flex-col items-center p-4 bg-neutral-900 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-purple-500/30 hover:shadow-2xl hover:scale-105"
      onMouseEnter={() => setIsPanelVisible(true)}
      onMouseLeave={() => setIsPanelVisible(false)}
      onFocusCapture={() => setIsPanelVisible(true)} 
      onBlurCapture={(e) => { 
         if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsPanelVisible(false);
          }
      }}
      onKeyPress={handleCardKeyPress}
      role="button" 
      tabIndex={0}
      aria-expanded={isPanelVisible}
      aria-label={`Song card for ${song.title}. Press space or enter to toggle player controls.`}
    >
      <div className={`relative w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 mb-5 overflow-hidden rounded-md bg-neutral-800 shadow-inner transition-opacity duration-300 ${isPanelVisible ? 'opacity-70' : 'opacity-100'}`}>
        <img
          src={song.albumArtUrl}
          alt={`${song.title} Album Sleeve`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
          loading="lazy"
        />
        <div
          className={`
            absolute top-[2.5%] left-[2.5%] w-[95%] h-[95%] bg-black rounded-full
            flex items-center justify-center origin-center
            ${isPlaying ? 'animate-spin' : ''} shadow-xl 
          `}
          style={{ animationDuration: isPlaying ? '3s' : '0s' }} 
          aria-hidden="true"
        >
          <img
            src={song.albumArtUrl}
            alt=""
            className="w-[45%] h-[45%] rounded-full object-cover border-2 border-neutral-700 shadow-md"
          />
          <div className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-neutral-800 rounded-full border border-neutral-600"></div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`groove-${i}`}
              className="absolute rounded-full border border-neutral-700/30"
              style={{ width: `${55 + i * 10}%`, height: `${55 + i * 10}%` }}
            ></div>
          ))}
        </div>
      </div>

      <h3 className={`text-lg sm:text-xl font-semibold text-neutral-100 mb-1 text-center truncate w-full px-2 transition-opacity duration-300 ${isPanelVisible ? 'opacity-0' : 'opacity-100'}`} id={`song-title-${song.id}`}>
        {song.title}
      </h3>
      <p className={`text-xs sm:text-sm text-purple-400 group-hover:text-pink-500 transition-colors duration-300 transition-opacity ${isPanelVisible ? 'opacity-0' : 'opacity-100'}`}>
        {displayArtist}
      </p>
      
      <audio ref={audioRef} loop={false} preload="metadata" aria-labelledby={`song-title-${song.id}`}></audio>

      <div
        className={`absolute inset-0 top-0 left-0 w-full h-full bg-black bg-opacity-80 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-between items-center text-center text-white transition-all duration-300 ease-in-out transform ${
          isPanelVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
        aria-hidden={!isPanelVisible}
      >
        <div className="w-full pt-2"> 
          <h4 className="text-lg sm:text-xl font-bold truncate mb-0.5">{song.title}</h4>
          <p className="text-xs sm:text-sm text-neutral-300 mb-2">{displayArtist}</p>
        </div>
        
        <div className="flex-grow w-full min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem]"></div> 
        
        <div className="w-full mb-2">
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="w-full h-2 bg-neutral-700 rounded-full cursor-pointer mb-1"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-valuetext={`Time: ${formatTime(currentTime)} of ${formatTime(duration)}`}
            tabIndex={isPanelVisible ? 0 : -1}
            onKeyPress={(e) => {
              if (e.key === 'ArrowLeft') seek(-5);
              if (e.key === 'ArrowRight') seek(5);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-around w-full space-x-3 pb-2">
          <button 
            onClick={() => seek(-5)} 
            className="text-neutral-300 hover:text-purple-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500" 
            aria-label="Rewind 5 seconds"
            tabIndex={isPanelVisible ? 0 : -1}
          >
            <Rewind5sIcon />
          </button>
          <button 
            onClick={togglePlayPause} 
            className="p-2 bg-purple-600 hover:bg-purple-500 rounded-full text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/80 focus:ring-purple-400" 
            aria-label={isPlaying ? 'Pause' : 'Play'}
            tabIndex={isPanelVisible ? 0 : -1}
          >
            {isPlaying ? <PauseIcon className="w-6 h-6 sm:w-7 sm:h-7" /> : <PlayIcon className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
          <button 
            onClick={() => seek(5)} 
            className="text-neutral-300 hover:text-purple-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500" 
            aria-label="Forward 5 seconds"
            tabIndex={isPanelVisible ? 0 : -1}
          >
            <Forward5sIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VinylSongCard;
