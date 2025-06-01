
import React from 'react';
import { Song } from '../types.ts';
import VinylSongCard from './VinylSongCard.tsx';

interface VaultContentProps {
  song: Song;
  playingSongId: string | null;
  onSongPlay: (songId: string) => void;
  // globalVolume: number; // Removed
}

const VaultContent: React.FC<VaultContentProps> = ({ song, playingSongId, onSongPlay }) => {
  return (
    <main className="vault-content container mx-auto px-4 py-10 sm:py-16">
      <h2 className="text-4xl sm:text-5xl font-bold mb-10 text-center tracking-tight"> {/* Base styles, color/shadow overridden by vault-mode-active in CSS */}
        The Vault
      </h2>
      <div className="flex justify-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-xs"> 
          <VinylSongCard 
            song={song} 
            onPlay={onSongPlay}
            currentlyPlayingId={playingSongId}
            // globalVolume={globalVolume} // Removed
          />
        </div>
      </div>
       <p className="text-center mt-8 text-lg"> {/* Base styles, color overridden by vault-mode-active in CSS */}
        Welcome. You've unlocked an exclusive track.
      </p>
    </main>
  );
};

export default VaultContent;
