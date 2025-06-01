
import React, { useState, useCallback, useEffect } from 'react';
import { Song } from './types';
import Header from './components/Header';
import VinylSongCard from './components/VinylSongCard';
import VaultModal from './components/VaultModal';
import VaultContent from './components/VaultContent';
import MouseTrail from './components/MouseTrail';
import MouseTrailToggle from './components/MouseTrailToggle';
import CountdownTimer from './components/CountdownTimer';
import useIsMobile from './hooks/useIsMobile'; // Import the new hook

const songsData: Song[] = [
  {
    id: '1',
    title: 'MADE OF',
    artist: 'Yung9',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e0260841de3f5e89768847f97a9',
    audioSnippetUrl: 'https://res.cloudinary.com/dxpexhv42/video/upload/v1748636855/MADE_OF_jncaiq.mp3',
  },
  {
    id: '2',
    title: 'GALAXY GAS FREESTYLE',
    artist: 'Yung9',
    featuredArtist: 'Big B',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e028c231e6e6bb7b8b2597d84bc',
    audioSnippetUrl: 'https://res.cloudinary.com/dxpexhv42/video/upload/v1748717730/SpotiDownloader.com_-_GALAXY_GAS_FREESTYLE_-_yung9_ou9aju.mp3',
  },
  {
    id: '3',
    title: 'WHERE HE GO',
    artist: 'Yung9',
    featuredArtist: 'K Kizzy',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e024734883880d1f8df33b54ac8',
    audioSnippetUrl: 'https://res.cloudinary.com/dxpexhv42/video/upload/v1748636655/SpotiDownloader.com_-_WHERE_HE_GO_-_yung9_udjdpz.mp3',
  },
  {
    id: '4', // CLOUD9 moved to be the 4th song
    title: 'CLOUD9',
    artist: 'Yung9',
    featuredArtist: 'Maz',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e02378bfcddba9228a69dbf3d82',
    audioSnippetUrl: 'https://res.cloudinary.com/dxpexhv42/video/upload/v1748646140/CLOUD9_feat._maz_1_uumhhb.mp3',
  },
  {
    id: '5', // GIMME DA CART is now the 5th song
    title: 'GIMME DA CART',
    artist: 'Yung9',
    albumArtUrl: 'https://res.cloudinary.com/dxpexhv42/image/upload/v1748730591/400x400_afkvik.jpg', 
    audioSnippetUrl: 'https://res.cloudinary.com/dxpexhv42/video/upload/v1748731078/SNEAKPEEK_vib43q.wav', 
  },
];

const vaultSongData: Song = {
  id: 'vault-new-season',
  title: 'New Season',
  artist: 'Yung9',
  albumArtUrl: 'https://i.ytimg.com/vi/PF5NoIKe2N8/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDZ8Y_AAeOLHccXr32LXS8fNcpFxQ',
  audioSnippetUrl: 'https://res.cloudinary.com/dxpexhv42/video/upload/v1748646492/Yung9_-_New_Season_nks6jt.mp3',
};

const LOCAL_STORAGE_MOUSE_TRAIL_KEY = 'yung9_mouseTrailActive';
const LOCAL_STORAGE_VAULT_UNLOCKED_KEY = 'yung9_vaultUnlocked';

const SONGS_IN_MAIN_GRID = 4;

const App: React.FC = () => {
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState<boolean>(() => {
    const storedVaultStatus = localStorage.getItem(LOCAL_STORAGE_VAULT_UNLOCKED_KEY);
    return storedVaultStatus ? JSON.parse(storedVaultStatus) : false;
  });
  const [showingVaultContent, setShowingVaultContent] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [isMouseTrailActive, setIsMouseTrailActive] = useState<boolean>(() => {
    const storedPreference = localStorage.getItem(LOCAL_STORAGE_MOUSE_TRAIL_KEY);
    return storedPreference ? JSON.parse(storedPreference) : true; 
  });

  const isMobile = useIsMobile(); // Determine if the device is mobile

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MOUSE_TRAIL_KEY, JSON.stringify(isMouseTrailActive));
  }, [isMouseTrailActive]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_VAULT_UNLOCKED_KEY, JSON.stringify(vaultUnlocked));
  }, [vaultUnlocked]);


  const toggleMouseTrail = useCallback(() => {
    setIsMouseTrailActive(prev => !prev);
  }, []);

  const handleSongPlay = useCallback((songId: string) => {
    setPlayingSongId(songId);
  }, []);

  const handleVaultButtonClick = useCallback(() => {
    if (!vaultUnlocked) {
      setShowVaultModal(true);
    } else {
      setShowingVaultContent(prev => !prev);
    }
  }, [vaultUnlocked]);

  const handleUnlockVault = useCallback(() => {
    setVaultUnlocked(true); 
    setShowVaultModal(false);
    setShowingVaultContent(true);
  }, []);

  const handleCloseVaultModal = useCallback(() => {
    setShowVaultModal(false);
  }, []);

  const handleApplyButtonClick = () => {
    alert("Applications are closed right now.");
  };

  let vaultButtonText = "The Vault";
  if (vaultUnlocked) {
    vaultButtonText = showingVaultContent ? "Exit The Vault" : "Enter The Vault";
  }

  const gridSongs = songsData.slice(0, SONGS_IN_MAIN_GRID);
  const centeredSong = songsData.length > SONGS_IN_MAIN_GRID ? songsData[SONGS_IN_MAIN_GRID] : null;
  
  const targetLaunchDate = new Date(new Date().getFullYear(), 5, 30);


  return (
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white flex flex-col">
      {!isMobile && isMouseTrailActive && <MouseTrail />}
      {!isMobile && (
        <MouseTrailToggle 
          isActive={isMouseTrailActive}
          onToggle={toggleMouseTrail}
        />
      )}
      <Header 
        onVaultClick={handleVaultButtonClick}
        vaultButtonText={vaultButtonText}
        isVaultOpen={showingVaultContent && vaultUnlocked}
        isVaultUnlocked={vaultUnlocked}
      />
      
      <CountdownTimer targetDate={targetLaunchDate} />

      <div className="flex-grow">
        {showingVaultContent && vaultUnlocked ? (
          <VaultContent 
            song={vaultSongData} 
            playingSongId={playingSongId}
            onSongPlay={handleSongPlay}
          />
        ) : (
          <>
            <main className="container mx-auto px-4 py-10 sm:py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {gridSongs.map(song => (
                  <VinylSongCard 
                    key={song.id} 
                    song={song} 
                    onPlay={handleSongPlay}
                    currentlyPlayingId={playingSongId}
                  />
                ))}
              </div>
              {centeredSong && (
                <div className="flex justify-center mt-12 sm:mt-16">
                  <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 tracking-tight text-center [text-shadow:0_0_6px_rgba(250,204,21,0.6)]">
                      SNEAK PEEK OF NEW SONG
                    </h3>
                    <VinylSongCard
                      key={centeredSong.id}
                      song={centeredSong}
                      onPlay={handleSongPlay}
                      currentlyPlayingId={playingSongId}
                    />
                  </div>
                </div>
              )}
            </main>

            <section className="container mx-auto px-4 py-10 sm:py-16">
              <div className="md:flex md:items-center md:space-x-8 lg:space-x-12">
                <div className="w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0 flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dxpexhv42/image/upload/v1748637374/unnamed_oja17g.jpg"
                    alt="Photo of Yung9"
                    className="rounded-lg w-full h-auto object-cover aspect-square md:aspect-auto shadow-[0px_0px_25px_5px_rgba(59,130,246,0.4)] hover:shadow-[0px_0px_35px_10px_rgba(59,130,246,0.6)] transition-shadow duration-300 ease-in-out"
                    loading="lazy"
                  />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6 tracking-tight [text-shadow:0_0_6px_rgba(74,222,128,0.6)]">
                    About Yung9
                  </h2>
                  <p className="text-neutral-300 text-lg sm:text-xl leading-relaxed">
                    Emerging from the underground scene, Yung9 is a dynamic rapper known for his introspective lyrics and versatile flows.
                    With a sound that blends modern trap influences with classic hip-hop sensibilities, he captivates listeners with authentic storytelling and a raw, energetic delivery.
                    Yung9 is quickly making a name for himself, pushing boundaries and carving out his unique space in the music world.
                  </p>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 py-10 sm:py-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-8 text-center tracking-tight [text-shadow:0_0_6px_rgba(74,222,128,0.6)]">
                Connect with Yung9
              </h2>
              <div className="flex justify-center items-center space-x-6 sm:space-x-8">
                <a
                  href="https://open.spotify.com/artist/7nzwIvWYVdG7sxrrD7qdUB"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yung9 on Spotify"
                  className="text-neutral-400 hover:text-[#1DB954] hover:[filter:drop-shadow(0px_0px_10px_rgba(30,215,96,0.7))] transition-all duration-300"
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <title>Spotify</title>
                    <circle cx="12" cy="12" r="12" fill="currentColor"/>
                    <path d="M16.9518 15.0047C16.7842 14.6653 16.3837 14.5303 16.0443 14.6979C13.5421 15.993 10.7295 16.2082 7.95489 15.49C7.57358 15.3819 7.19218 15.614 7.08409 15.9953C6.976 16.3766 7.20808 16.758 7.58939 16.8661C10.7022 17.6712 13.8431 17.4208 16.6736 15.9483C17.013 15.7807 17.1194 15.3441 16.9518 15.0047Z" fill="white"/>
                    <path d="M17.9472 12.0775C17.7158 11.6616 17.2205 11.4786 16.8046 11.71C13.9189 13.2765 10.4087 13.5767 7.44043 12.7016C6.98057 12.5735 6.51955 12.7957 6.39149 13.2556C6.26342 13.7154 6.48563 14.1765 6.94549 14.3045C10.3762 15.293 14.3219 14.9314 17.5773 13.1253C17.9932 12.8938 18.1762 12.3985 17.9472 12.0775Z" fill="white"/>
                    <path d="M18.9534 9.03469C18.6426 8.54862 18.0426 8.32505 17.5565 8.6358C14.2041 10.5517 9.89581 10.6896 6.79599 9.76415C6.26477 9.60806 5.74112 9.85543 5.58503 10.3866C5.42894 10.9179 5.67631 11.4415 6.20753 11.5976C9.77985 12.6455 14.5725 12.4714 18.3472 10.2783C18.8333 9.96757 19.0569 9.36416 18.9534 9.03469Z" fill="white"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC3dqZkPkJu8ZTW0bA2YuTjQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yung9 on YouTube"
                  className="text-neutral-400 hover:text-[#FF0000] hover:[filter:drop-shadow(0px_0px_10px_rgba(255,0,0,0.7))] transition-all duration-300"
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://snapchat.com/t/lpAo6DeD"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yung9 on Snapchat"
                  className="group text-neutral-400 hover:text-[#FFFC00] hover:[filter:drop-shadow(0px_0px_10px_rgba(255,252,0,0.7))] transition-all duration-300"
                >
                  <img
                    src="https://logos-world.net/wp-content/uploads/2020/04/Snapchat-Symbol.png"
                    alt="Snapchat"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain filter grayscale brightness-[.64] group-hover:filter-none transition-all duration-300"
                    loading="lazy"
                  />
                </a>
              </div>
            </section>

            <section className="container mx-auto px-4 py-10 sm:py-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-6 text-center tracking-tight [text-shadow:0_0_6px_rgba(96,165,250,0.6)]">
                Need a Custom Website?
              </h2>
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-neutral-300 text-lg sm:text-xl leading-relaxed mb-8">
                  Interested in a unique website like this? Reach out to get started.
                </p>
                <button
                  type="button"
                  onClick={handleApplyButtonClick}
                  className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105"
                  aria-label="Check application status"
                >
                  Click to Apply
                </button>
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="text-center py-8 text-neutral-500 text-sm">
        <p>&copy; 2025 Tyler Alexander LLC</p>
      </footer>

      {showVaultModal && (
        <VaultModal
          onClose={handleCloseVaultModal}
          onUnlock={handleUnlockVault}
        />
      )}
    </div>
  );
};

export default App;
