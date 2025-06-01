
import React from 'react';
import { Song } from '../types.ts';
import VinylSongCard from './VinylSongCard.tsx';

interface VaultContentProps {
  song: Song;
  playingSongId: string | null;
  onSongPlay: (songId: string) => void;
}

const VaultContent: React.FC<VaultContentProps> = ({ song, playingSongId, onSongPlay }) => {
  return (
    <main className="container mx-auto px-4 py-10 sm:py-16">
      <h2 className="text-4xl sm:text-5xl font-bold text-red-400 mb-10 text-center tracking-tight [text-shadow:0_0_10px_rgba(248,113,113,0.7)]">
        The Vault
      </h2>
      <div className="flex justify-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-xs"> 
          {/* Constrain the width of the card container for better centering on large screens */}
          <VinylSongCard 
            song={song} 
            onPlay={onSongPlay}
            currentlyPlayingId={playingSongId}
          />
        </div>
      </div>
       <p className="text-center text-neutral-400 mt-8 text-lg">
        Welcome. You've unlocked an exclusive track.
      </p>
    </main>
  );
};

export default VaultContent;
