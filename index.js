// index.tsx
import React6 from "react";
import ReactDOM from "react-dom/client";

// App.tsx
import { useState as useState5, useCallback as useCallback4, useEffect as useEffect6 } from "react";

// components/Header.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Header = ({
  onVaultClick,
  vaultButtonText,
  isVaultOpen,
  isVaultUnlocked
  // Props removed from destructuring
}) => {
  return /* @__PURE__ */ jsx("header", { className: "relative py-8 sm:py-10 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-center shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-80", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      "h1",
      {
        className: "text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 tracking-tight leading-tight [text-shadow:0_0_8px_rgba(50,205,50,0.7)]",
        children: [
          "Yung",
          /* @__PURE__ */ jsx("span", { className: "font-light", children: "9" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-green-300 mt-2 sm:mt-3 text-lg sm:text-xl [text-shadow:0_0_5px_rgba(50,205,50,0.5)]", children: "Song Showcase" }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onVaultClick,
        "aria-label": vaultButtonText,
        className: `
              px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${!isVaultUnlocked ? "bg-red-600 hover:bg-red-700 focus:ring-red-400 shadow-[0_0_10px_2px_rgba(220,38,38,0.6)] hover:shadow-[0_0_15px_5px_rgba(220,38,38,0.8)]" : isVaultOpen ? "bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-500" : "bg-red-500 hover:bg-red-600 focus:ring-red-400 shadow-[0_0_8px_1px_rgba(239,68,68,0.5)] hover:shadow-[0_0_12px_3px_rgba(239,68,68,0.7)]"}
            `,
        children: vaultButtonText
      }
    ) })
  ] }) });
};
var Header_default = Header;

// components/VinylSongCard.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var PlayIcon = ({ className = "w-7 h-7" }) => /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className, children: /* @__PURE__ */ jsx2("path", { fillRule: "evenodd", d: "M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z", clipRule: "evenodd" }) });
var PauseIcon = ({ className = "w-7 h-7" }) => /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className, children: /* @__PURE__ */ jsx2("path", { fillRule: "evenodd", d: "M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z", clipRule: "evenodd" }) });
var Rewind5sIcon = ({ className = "w-6 h-6" }) => /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", className, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" }) });
var Forward5sIcon = ({ className = "w-6 h-6" }) => /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", className, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.977 9.348h-4.992v-.001M21.015 19.644v-4.992m0 0h-4.992m4.993 0-3.181 3.183a8.25 8.25 0 0 1-13.803-3.7M19.969 9.865a8.25 8.25 0 0 0-13.803-3.7l-3.181 3.182m0-4.991v4.99" }) });
var formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
var VinylSongCard = ({ song, onPlay, currentlyPlayingId }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
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
  const handleAudioError = useCallback((e) => {
    const mediaError = e.target?.error;
    let errorMessage = "Unknown audio error";
    if (mediaError) {
      switch (mediaError.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio fetch aborted by user.";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "A network error caused the audio download to fail.";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio playback aborted due to a corruption problem or features not supported by browser.";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio source not supported. (Often a CORS issue or invalid URL)";
          break;
        default:
          errorMessage = `An unknown error occurred. Code: ${mediaError.code}`;
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
        }, 500);
      }
    };
    const onTimeUpdateInternal = () => {
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);
      }
    };
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdateInternal);
    audio.addEventListener("play", handleAudioPlay);
    audio.addEventListener("pause", handleAudioPause);
    audio.addEventListener("ended", handleAudioEnded);
    audio.addEventListener("error", handleAudioError);
    audio.preload = "metadata";
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (audio.currentSrc !== song.audioSnippetUrl || audio.src !== song.audioSnippetUrl) {
      audio.src = song.audioSnippetUrl;
      audio.load();
    } else if (audio.readyState === 0) {
      audio.load();
    }
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdateInternal);
      audio.removeEventListener("play", handleAudioPlay);
      audio.removeEventListener("pause", handleAudioPause);
      audio.removeEventListener("ended", handleAudioEnded);
      audio.removeEventListener("error", handleAudioError);
      if (audio && !audio.paused) {
        audio.pause();
      }
    };
  }, [song.audioSnippetUrl, song.title, handleAudioPlay, handleAudioPause, handleAudioEnded, handleAudioError]);
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
      audio.play().catch((error) => {
        console.error(`[VinylSongCard - ${song.title}] Error playing audio:`, error);
      });
    } else {
      audio.pause();
    }
  }, [song.title]);
  const seek = useCallback((delta) => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;
    const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);
  const handleProgressBarClick = useCallback((e) => {
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
  const handleCardKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsPanelVisible((prev) => !prev);
    }
  };
  const progressPercentage = duration > 0 ? currentTime / duration * 100 : 0;
  const displayArtist = song.featuredArtist ? `${song.artist} (feat. ${song.featuredArtist})` : song.artist;
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      className: "group relative flex flex-col items-center p-4 bg-neutral-900 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-purple-500/30 hover:shadow-2xl hover:scale-105",
      onMouseEnter: () => setIsPanelVisible(true),
      onMouseLeave: () => setIsPanelVisible(false),
      onFocusCapture: () => setIsPanelVisible(true),
      onBlurCapture: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsPanelVisible(false);
        }
      },
      onKeyPress: handleCardKeyPress,
      role: "button",
      tabIndex: 0,
      "aria-expanded": isPanelVisible,
      "aria-label": `Song card for ${song.title}. Press space or enter to toggle player controls.`,
      children: [
        /* @__PURE__ */ jsxs2("div", { className: `relative w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 mb-5 overflow-hidden rounded-md bg-neutral-800 shadow-inner transition-opacity duration-300 ${isPanelVisible ? "opacity-70" : "opacity-100"}`, children: [
          /* @__PURE__ */ jsx2(
            "img",
            {
              src: song.albumArtUrl,
              alt: `${song.title} Album Sleeve`,
              className: "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxs2(
            "div",
            {
              className: `
            absolute top-[2.5%] left-[2.5%] w-[95%] h-[95%] bg-black rounded-full
            flex items-center justify-center origin-center
            ${isPlaying ? "animate-spin" : ""} shadow-xl 
          `,
              style: { animationDuration: isPlaying ? "3s" : "0s" },
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsx2(
                  "img",
                  {
                    src: song.albumArtUrl,
                    alt: "",
                    className: "w-[45%] h-[45%] rounded-full object-cover border-2 border-neutral-700 shadow-md"
                  }
                ),
                /* @__PURE__ */ jsx2("div", { className: "absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-neutral-800 rounded-full border border-neutral-600" }),
                Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx2(
                  "div",
                  {
                    className: "absolute rounded-full border border-neutral-700/30",
                    style: { width: `${55 + i * 10}%`, height: `${55 + i * 10}%` }
                  },
                  `groove-${i}`
                ))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx2("h3", { className: `text-lg sm:text-xl font-semibold text-neutral-100 mb-1 text-center truncate w-full px-2 transition-opacity duration-300 ${isPanelVisible ? "opacity-0" : "opacity-100"}`, id: `song-title-${song.id}`, children: song.title }),
        /* @__PURE__ */ jsx2("p", { className: `text-xs sm:text-sm text-purple-400 group-hover:text-pink-500 transition-colors duration-300 transition-opacity ${isPanelVisible ? "opacity-0" : "opacity-100"}`, children: displayArtist }),
        /* @__PURE__ */ jsx2("audio", { ref: audioRef, loop: false, preload: "metadata", "aria-labelledby": `song-title-${song.id}` }),
        /* @__PURE__ */ jsxs2(
          "div",
          {
            className: `absolute inset-0 top-0 left-0 w-full h-full bg-black bg-opacity-80 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-between items-center text-center text-white transition-all duration-300 ease-in-out transform ${isPanelVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`,
            "aria-hidden": !isPanelVisible,
            children: [
              /* @__PURE__ */ jsxs2("div", { className: "w-full pt-2", children: [
                /* @__PURE__ */ jsx2("h4", { className: "text-lg sm:text-xl font-bold truncate mb-0.5", children: song.title }),
                /* @__PURE__ */ jsx2("p", { className: "text-xs sm:text-sm text-neutral-300 mb-2", children: displayArtist })
              ] }),
              /* @__PURE__ */ jsx2("div", { className: "flex-grow w-full min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem]" }),
              /* @__PURE__ */ jsxs2("div", { className: "w-full mb-2", children: [
                /* @__PURE__ */ jsx2(
                  "div",
                  {
                    ref: progressBarRef,
                    onClick: handleProgressBarClick,
                    className: "w-full h-2 bg-neutral-700 rounded-full cursor-pointer mb-1",
                    role: "slider",
                    "aria-valuemin": 0,
                    "aria-valuemax": duration,
                    "aria-valuenow": currentTime,
                    "aria-valuetext": `Time: ${formatTime(currentTime)} of ${formatTime(duration)}`,
                    tabIndex: isPanelVisible ? 0 : -1,
                    onKeyPress: (e) => {
                      if (e.key === "ArrowLeft") seek(-5);
                      if (e.key === "ArrowRight") seek(5);
                    },
                    children: /* @__PURE__ */ jsx2(
                      "div",
                      {
                        className: "h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full",
                        style: { width: `${progressPercentage}%` }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs2("div", { className: "flex justify-between text-xs text-neutral-400", children: [
                  /* @__PURE__ */ jsx2("span", { children: formatTime(currentTime) }),
                  /* @__PURE__ */ jsx2("span", { children: formatTime(duration) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-around w-full space-x-3 pb-2", children: [
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    onClick: () => seek(-5),
                    className: "text-neutral-300 hover:text-purple-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500",
                    "aria-label": "Rewind 5 seconds",
                    tabIndex: isPanelVisible ? 0 : -1,
                    children: /* @__PURE__ */ jsx2(Rewind5sIcon, {})
                  }
                ),
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    onClick: togglePlayPause,
                    className: "p-2 bg-purple-600 hover:bg-purple-500 rounded-full text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/80 focus:ring-purple-400",
                    "aria-label": isPlaying ? "Pause" : "Play",
                    tabIndex: isPanelVisible ? 0 : -1,
                    children: isPlaying ? /* @__PURE__ */ jsx2(PauseIcon, { className: "w-6 h-6 sm:w-7 sm:h-7" }) : /* @__PURE__ */ jsx2(PlayIcon, { className: "w-6 h-6 sm:w-7 sm:h-7" })
                  }
                ),
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    onClick: () => seek(5),
                    className: "text-neutral-300 hover:text-purple-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500",
                    "aria-label": "Forward 5 seconds",
                    tabIndex: isPanelVisible ? 0 : -1,
                    children: /* @__PURE__ */ jsx2(Forward5sIcon, {})
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
};
var VinylSongCard_default = VinylSongCard;

// components/VaultModal.tsx
import { useState as useState2, useEffect as useEffect2, useRef as useRef2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var VaultModal = ({ onClose, onUnlock }) => {
  const [password, setPassword] = useState2("");
  const [error, setError] = useState2("");
  const modalRef = useRef2(null);
  const passwordInputRef = useRef2(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "koontzanopp") {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect password. Try again.");
      setPassword("");
      passwordInputRef.current?.focus();
    }
  };
  useEffect2(() => {
    passwordInputRef.current?.focus();
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  useEffect2(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return /* @__PURE__ */ jsx3(
    "div",
    {
      className: "fixed inset-0 z-[60] bg-black bg-opacity-75 flex items-center justify-center p-4",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "vault-modal-title",
      children: /* @__PURE__ */ jsxs3(
        "div",
        {
          ref: modalRef,
          className: "bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-white border border-neutral-700",
          children: [
            /* @__PURE__ */ jsx3("h2", { id: "vault-modal-title", className: "text-2xl sm:text-3xl font-bold text-red-400 mb-6 text-center [text-shadow:0_0_6px_rgba(248,113,113,0.6)]", children: "Enter The Vault" }),
            /* @__PURE__ */ jsxs3("form", { onSubmit: handleSubmit, children: [
              /* @__PURE__ */ jsxs3("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx3("label", { htmlFor: "vault-password", className: "block text-sm font-medium text-neutral-300 mb-1", children: "Password" }),
                /* @__PURE__ */ jsx3(
                  "input",
                  {
                    ref: passwordInputRef,
                    type: "password",
                    id: "vault-password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "w-full px-3 py-2.5 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors",
                    placeholder: "************",
                    required: true,
                    "aria-describedby": error ? "password-error" : void 0
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsx3("p", { id: "password-error", className: "text-red-400 text-sm mb-4 text-center animate-pulse", role: "alert", children: error }),
              /* @__PURE__ */ jsxs3("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                /* @__PURE__ */ jsx3(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "w-full sm:w-auto flex-1 px-4 py-2.5 bg-neutral-600 hover:bg-neutral-500 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-75",
                    "aria-label": "Cancel and close modal",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx3(
                  "button",
                  {
                    type: "submit",
                    className: "w-full sm:w-auto flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-[0_0_8px_rgba(220,38,38,0.5)]",
                    "aria-label": "Unlock The Vault",
                    children: "Unlock"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
};
var VaultModal_default = VaultModal;

// components/VaultContent.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var VaultContent = ({ song, playingSongId, onSongPlay }) => {
  return /* @__PURE__ */ jsxs4("main", { className: "container mx-auto px-4 py-10 sm:py-16", children: [
    /* @__PURE__ */ jsx4("h2", { className: "text-4xl sm:text-5xl font-bold text-red-400 mb-10 text-center tracking-tight [text-shadow:0_0_10px_rgba(248,113,113,0.7)]", children: "The Vault" }),
    /* @__PURE__ */ jsx4("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx4("div", { className: "w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-xs", children: /* @__PURE__ */ jsx4(
      VinylSongCard_default,
      {
        song,
        onPlay: onSongPlay,
        currentlyPlayingId: playingSongId
      }
    ) }) }),
    /* @__PURE__ */ jsx4("p", { className: "text-center text-neutral-400 mt-8 text-lg", children: "Welcome. You've unlocked an exclusive track." })
  ] });
};
var VaultContent_default = VaultContent;

// components/MouseTrail.tsx
import { useRef as useRef3, useEffect as useEffect3, useCallback as useCallback2 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var MAX_LIFETIME = 40;
var TRAIL_COLOR_RGB = [144, 238, 144];
var MAX_POINTS = 60;
var MIN_POINT_DISTANCE = 5;
var INITIAL_LINE_WIDTH = 5;
var MouseTrail = () => {
  const canvasRef = useRef3(null);
  const pointsRef = useRef3([]);
  const animationFrameIdRef = useRef3(null);
  const lastMousePositionRef = useRef3(null);
  const addPoint = useCallback2((x, y) => {
    let dx = 0;
    let dy = 0;
    if (lastMousePositionRef.current) {
      dx = x - lastMousePositionRef.current.x;
      dy = y - lastMousePositionRef.current.y;
    }
    const newPoint = { x, y, lifetime: MAX_LIFETIME, dx, dy };
    pointsRef.current.unshift(newPoint);
    if (pointsRef.current.length > MAX_POINTS) {
      pointsRef.current.pop();
    }
    lastMousePositionRef.current = { x, y };
  }, []);
  const handleMouseMove = useCallback2((event) => {
    if (lastMousePositionRef.current) {
      const distX = event.clientX - lastMousePositionRef.current.x;
      const distY = event.clientY - lastMousePositionRef.current.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
      if (distance < MIN_POINT_DISTANCE) {
        return;
      }
    }
    addPoint(event.clientX, event.clientY);
  }, [addPoint]);
  const drawTrail = useCallback2((ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const points = pointsRef.current;
    if (points.length < 2) {
      return;
    }
    if (points.length < 3) {
      const p0 = points[0];
      const p1 = points[1];
      const opacity = p0.lifetime / MAX_LIFETIME;
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * (opacity * opacity));
      if (opacity > 0 && lineWidth > 0.1) {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB[0]}, ${TRAIL_COLOR_RGB[1]}, ${TRAIL_COLOR_RGB[2]}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
      return;
    }
    for (let i = 0; i < points.length - 2; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const p2 = points[i + 2];
      const startX = i === 0 ? p0.x : (p0.x + p1.x) / 2;
      const startY = i === 0 ? p0.y : (p0.y + p1.y) / 2;
      const endX = (p1.x + p2.x) / 2;
      const endY = (p1.y + p2.y) / 2;
      const opacity = p0.lifetime / MAX_LIFETIME;
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * (opacity * opacity));
      if (opacity <= 0 || lineWidth <= 0.1) continue;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(p1.x, p1.y, endX, endY);
      ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB[0]}, ${TRAIL_COLOR_RGB[1]}, ${TRAIL_COLOR_RGB[2]}, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    if (points.length >= 2) {
      const lastP = points[points.length - 2];
      const veryLastP = points[points.length - 1];
      const opacity = lastP.lifetime / MAX_LIFETIME;
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * (opacity * opacity));
      if (opacity > 0 && lineWidth > 0.1 && points.length > 2) {
        const prevMidX = (lastP.x + veryLastP.x) / 2;
        const prevMidY = (lastP.y + veryLastP.y) / 2;
        ctx.beginPath();
        ctx.moveTo(prevMidX, prevMidY);
        ctx.lineTo(veryLastP.x, veryLastP.y);
        ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB[0]}, ${TRAIL_COLOR_RGB[1]}, ${TRAIL_COLOR_RGB[2]}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    }
  }, []);
  const animate = useCallback2(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    pointsRef.current = pointsRef.current.filter((p) => {
      p.lifetime--;
      return p.lifetime > 0;
    });
    if (pointsRef.current.length < 2) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      drawTrail(ctx);
    }
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [drawTrail]);
  useEffect3(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    window.addEventListener("mousemove", handleMouseMove);
    animationFrameIdRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      pointsRef.current = [];
      lastMousePositionRef.current = null;
    };
  }, [handleMouseMove, animate]);
  return /* @__PURE__ */ jsx5("canvas", { id: "mouse-trail-canvas", ref: canvasRef, "aria-hidden": "true" });
};
var MouseTrail_default = MouseTrail;

// components/MouseTrailToggle.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
var MouseTrailToggle = ({ isActive, onToggle }) => {
  return /* @__PURE__ */ jsx6(
    "button",
    {
      type: "button",
      onClick: onToggle,
      className: `
        fixed bottom-4 right-4 z-40 /* Changed to fixed and z-40 */
        px-4 py-2.5 rounded-lg font-semibold text-white 
        transition-all duration-300 ease-in-out shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900
        ${isActive ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"}
      `,
      "aria-pressed": isActive,
      "aria-label": isActive ? "Turn off mouse trail" : "Turn on mouse trail",
      children: isActive ? "Turn Off Mouse Trail" : "Turn On Mouse Trail"
    }
  );
};
var MouseTrailToggle_default = MouseTrailToggle;

// components/CountdownTimer.tsx
import { useState as useState3, useEffect as useEffect4, useCallback as useCallback3 } from "react";
import { Fragment, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = useCallback3(() => {
    const difference = +targetDate - +/* @__PURE__ */ new Date();
    let timeLeft2 = null;
    if (difference > 0) {
      timeLeft2 = {
        days: Math.floor(difference / (1e3 * 60 * 60 * 24)),
        hours: Math.floor(difference / (1e3 * 60 * 60) % 24),
        minutes: Math.floor(difference / 1e3 / 60 % 60),
        seconds: Math.floor(difference / 1e3 % 60)
      };
    }
    return timeLeft2;
  }, [targetDate]);
  const [timeLeft, setTimeLeft] = useState3(calculateTimeLeft());
  const [isClient, setIsClient] = useState3(false);
  useEffect4(() => {
    setIsClient(true);
  }, []);
  useEffect4(() => {
    if (!isClient) return;
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1e3);
    return () => clearInterval(timer);
  }, [calculateTimeLeft, isClient, targetDate]);
  if (!isClient) {
    return /* @__PURE__ */ jsxs5("div", { className: "text-center py-6 sm:py-8 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-md", children: [
      /* @__PURE__ */ jsx7("h2", { className: "text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight [text-shadow:0_0_8px_rgba(250,204,21,0.7)] mb-3", children: "ALBUM JUNE 30TH" }),
      /* @__PURE__ */ jsx7("div", { className: "text-xl sm:text-2xl text-neutral-300 font-mono", children: "Loading countdown..." })
    ] });
  }
  const timerComponents = [];
  if (timeLeft) {
    Object.keys(timeLeft).forEach((interval) => {
      const value = timeLeft[interval];
      if (value < 0) return;
      timerComponents.push(
        /* @__PURE__ */ jsxs5("span", { className: "mx-1 sm:mx-2", children: [
          /* @__PURE__ */ jsx7("span", { className: "text-2xl sm:text-3xl md:text-4xl font-semibold text-green-400", children: String(value).padStart(2, "0") }),
          /* @__PURE__ */ jsx7("span", { className: "text-xs sm:text-sm text-neutral-400 ml-1", children: interval.charAt(0).toUpperCase() + interval.slice(1) })
        ] }, interval)
      );
    });
  }
  return /* @__PURE__ */ jsxs5("div", { className: "text-center py-6 sm:py-8 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-md", children: [
    /* @__PURE__ */ jsx7(
      "h2",
      {
        className: "text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 tracking-tight mb-3 sm:mb-4 [text-shadow:0_0_10px_rgba(250,204,21,0.8)]",
        "aria-live": "polite",
        children: "ALBUM JUNE 30TH"
      }
    ),
    timerComponents.length ? /* @__PURE__ */ jsx7("div", { className: "text-xl sm:text-2xl text-neutral-300 font-mono tabular-nums", role: "timer", "aria-atomic": "true", children: timerComponents.reduce((prev, curr, index) => /* @__PURE__ */ jsxs5(Fragment, { children: [
      prev,
      index > 0 && /* @__PURE__ */ jsx7("span", { className: "text-neutral-500 mx-0.5 sm:mx-1", children: ":" }),
      curr
    ] }), /* @__PURE__ */ jsx7(Fragment, {})) }) : /* @__PURE__ */ jsx7("p", { className: "text-2xl sm:text-3xl font-bold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.7)]", "aria-live": "polite", children: "ALBUM OUT NOW!" })
  ] });
};
var CountdownTimer_default = CountdownTimer;

// hooks/useIsMobile.ts
import { useState as useState4, useEffect as useEffect5 } from "react";
var useIsMobile = () => {
  const [isMobile, setIsMobile] = useState4(false);
  useEffect5(() => {
    const checkDevice = () => {
      if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
        const PCOARSE = "(pointer:coarse)";
        const isTouchDevice = window.matchMedia(PCOARSE).matches;
        setIsMobile(isTouchDevice);
      } else {
        setIsMobile(false);
      }
    };
    checkDevice();
  }, []);
  return isMobile;
};
var useIsMobile_default = useIsMobile;

// App.tsx
import { Fragment as Fragment2, jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var songsData = [
  {
    id: "1",
    title: "MADE OF",
    artist: "Yung9",
    albumArtUrl: "https://i.scdn.co/image/ab67616d00001e0260841de3f5e89768847f97a9",
    audioSnippetUrl: "https://res.cloudinary.com/dxpexhv42/video/upload/v1748636855/MADE_OF_jncaiq.mp3"
  },
  {
    id: "2",
    title: "GALAXY GAS FREESTYLE",
    artist: "Yung9",
    featuredArtist: "Big B",
    albumArtUrl: "https://i.scdn.co/image/ab67616d00001e028c231e6e6bb7b8b2597d84bc",
    audioSnippetUrl: "https://res.cloudinary.com/dxpexhv42/video/upload/v1748717730/SpotiDownloader.com_-_GALAXY_GAS_FREESTYLE_-_yung9_ou9aju.mp3"
  },
  {
    id: "3",
    title: "WHERE HE GO",
    artist: "Yung9",
    featuredArtist: "K Kizzy",
    albumArtUrl: "https://i.scdn.co/image/ab67616d00001e024734883880d1f8df33b54ac8",
    audioSnippetUrl: "https://res.cloudinary.com/dxpexhv42/video/upload/v1748636655/SpotiDownloader.com_-_WHERE_HE_GO_-_yung9_udjdpz.mp3"
  },
  {
    id: "4",
    // CLOUD9 moved to be the 4th song
    title: "CLOUD9",
    artist: "Yung9",
    featuredArtist: "Maz",
    albumArtUrl: "https://i.scdn.co/image/ab67616d00001e02378bfcddba9228a69dbf3d82",
    audioSnippetUrl: "https://res.cloudinary.com/dxpexhv42/video/upload/v1748646140/CLOUD9_feat._maz_1_uumhhb.mp3"
  },
  {
    id: "5",
    // GIMME DA CART is now the 5th song
    title: "GIMME DA CART",
    artist: "Yung9",
    albumArtUrl: "https://res.cloudinary.com/dxpexhv42/image/upload/v1748730591/400x400_afkvik.jpg",
    audioSnippetUrl: "https://res.cloudinary.com/dxpexhv42/video/upload/v1748731078/SNEAKPEEK_vib43q.wav"
  }
];
var vaultSongData = {
  id: "vault-new-season",
  title: "New Season",
  artist: "Yung9",
  albumArtUrl: "https://i.ytimg.com/vi/PF5NoIKe2N8/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDZ8Y_AAeOLHccXr32LXS8fNcpFxQ",
  audioSnippetUrl: "https://res.cloudinary.com/dxpexhv42/video/upload/v1748646492/Yung9_-_New_Season_nks6jt.mp3"
};
var LOCAL_STORAGE_MOUSE_TRAIL_KEY = "yung9_mouseTrailActive";
var LOCAL_STORAGE_VAULT_UNLOCKED_KEY = "yung9_vaultUnlocked";
var SONGS_IN_MAIN_GRID = 4;
var App = () => {
  const [showVaultModal, setShowVaultModal] = useState5(false);
  const [vaultUnlocked, setVaultUnlocked] = useState5(() => {
    const storedVaultStatus = localStorage.getItem(LOCAL_STORAGE_VAULT_UNLOCKED_KEY);
    return storedVaultStatus ? JSON.parse(storedVaultStatus) : false;
  });
  const [showingVaultContent, setShowingVaultContent] = useState5(false);
  const [playingSongId, setPlayingSongId] = useState5(null);
  const [isMouseTrailActive, setIsMouseTrailActive] = useState5(() => {
    const storedPreference = localStorage.getItem(LOCAL_STORAGE_MOUSE_TRAIL_KEY);
    return storedPreference ? JSON.parse(storedPreference) : true;
  });
  const isMobile = useIsMobile_default();
  useEffect6(() => {
    localStorage.setItem(LOCAL_STORAGE_MOUSE_TRAIL_KEY, JSON.stringify(isMouseTrailActive));
  }, [isMouseTrailActive]);
  useEffect6(() => {
    localStorage.setItem(LOCAL_STORAGE_VAULT_UNLOCKED_KEY, JSON.stringify(vaultUnlocked));
  }, [vaultUnlocked]);
  const toggleMouseTrail = useCallback4(() => {
    setIsMouseTrailActive((prev) => !prev);
  }, []);
  const handleSongPlay = useCallback4((songId) => {
    setPlayingSongId(songId);
  }, []);
  const handleVaultButtonClick = useCallback4(() => {
    if (!vaultUnlocked) {
      setShowVaultModal(true);
    } else {
      setShowingVaultContent((prev) => !prev);
    }
  }, [vaultUnlocked]);
  const handleUnlockVault = useCallback4(() => {
    setVaultUnlocked(true);
    setShowVaultModal(false);
    setShowingVaultContent(true);
  }, []);
  const handleCloseVaultModal = useCallback4(() => {
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
  const targetLaunchDate = new Date((/* @__PURE__ */ new Date()).getFullYear(), 5, 30);
  return /* @__PURE__ */ jsxs6("div", { className: "min-h-screen text-white selection:bg-purple-500 selection:text-white flex flex-col", children: [
    !isMobile && isMouseTrailActive && /* @__PURE__ */ jsx8(MouseTrail_default, {}),
    !isMobile && /* @__PURE__ */ jsx8(
      MouseTrailToggle_default,
      {
        isActive: isMouseTrailActive,
        onToggle: toggleMouseTrail
      }
    ),
    /* @__PURE__ */ jsx8(
      Header_default,
      {
        onVaultClick: handleVaultButtonClick,
        vaultButtonText,
        isVaultOpen: showingVaultContent && vaultUnlocked,
        isVaultUnlocked: vaultUnlocked
      }
    ),
    /* @__PURE__ */ jsx8(CountdownTimer_default, { targetDate: targetLaunchDate }),
    /* @__PURE__ */ jsx8("div", { className: "flex-grow", children: showingVaultContent && vaultUnlocked ? /* @__PURE__ */ jsx8(
      VaultContent_default,
      {
        song: vaultSongData,
        playingSongId,
        onSongPlay: handleSongPlay
      }
    ) : /* @__PURE__ */ jsxs6(Fragment2, { children: [
      /* @__PURE__ */ jsxs6("main", { className: "container mx-auto px-4 py-10 sm:py-16", children: [
        /* @__PURE__ */ jsx8("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8", children: gridSongs.map((song) => /* @__PURE__ */ jsx8(
          VinylSongCard_default,
          {
            song,
            onPlay: handleSongPlay,
            currentlyPlayingId: playingSongId
          },
          song.id
        )) }),
        centeredSong && /* @__PURE__ */ jsx8("div", { className: "flex justify-center mt-12 sm:mt-16", children: /* @__PURE__ */ jsxs6("div", { className: "w-full max-w-xs sm:max-w-sm flex flex-col items-center", children: [
          /* @__PURE__ */ jsx8("h3", { className: "text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 tracking-tight text-center [text-shadow:0_0_6px_rgba(250,204,21,0.6)]", children: "SNEAK PEEK OF NEW SONG" }),
          /* @__PURE__ */ jsx8(
            VinylSongCard_default,
            {
              song: centeredSong,
              onPlay: handleSongPlay,
              currentlyPlayingId: playingSongId
            },
            centeredSong.id
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsx8("section", { className: "container mx-auto px-4 py-10 sm:py-16", children: /* @__PURE__ */ jsxs6("div", { className: "md:flex md:items-center md:space-x-8 lg:space-x-12", children: [
        /* @__PURE__ */ jsx8("div", { className: "w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0 flex-shrink-0", children: /* @__PURE__ */ jsx8(
          "img",
          {
            src: "https://res.cloudinary.com/dxpexhv42/image/upload/v1748637374/unnamed_oja17g.jpg",
            alt: "Photo of Yung9",
            className: "rounded-lg w-full h-auto object-cover aspect-square md:aspect-auto shadow-[0px_0px_25px_5px_rgba(59,130,246,0.4)] hover:shadow-[0px_0px_35px_10px_rgba(59,130,246,0.6)] transition-shadow duration-300 ease-in-out",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs6("div", { className: "flex-grow text-center md:text-left", children: [
          /* @__PURE__ */ jsx8("h2", { className: "text-3xl sm:text-4xl font-bold text-green-400 mb-6 tracking-tight [text-shadow:0_0_6px_rgba(74,222,128,0.6)]", children: "About Yung9" }),
          /* @__PURE__ */ jsx8("p", { className: "text-neutral-300 text-lg sm:text-xl leading-relaxed", children: "Emerging from the underground scene, Yung9 is a dynamic rapper known for his introspective lyrics and versatile flows. With a sound that blends modern trap influences with classic hip-hop sensibilities, he captivates listeners with authentic storytelling and a raw, energetic delivery. Yung9 is quickly making a name for himself, pushing boundaries and carving out his unique space in the music world." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs6("section", { className: "container mx-auto px-4 py-10 sm:py-16", children: [
        /* @__PURE__ */ jsx8("h2", { className: "text-3xl sm:text-4xl font-bold text-green-400 mb-8 text-center tracking-tight [text-shadow:0_0_6px_rgba(74,222,128,0.6)]", children: "Connect with Yung9" }),
        /* @__PURE__ */ jsxs6("div", { className: "flex justify-center items-center space-x-6 sm:space-x-8", children: [
          /* @__PURE__ */ jsx8(
            "a",
            {
              href: "https://open.spotify.com/artist/7nzwIvWYVdG7sxrrD7qdUB",
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": "Yung9 on Spotify",
              className: "text-neutral-400 hover:text-[#1DB954] hover:[filter:drop-shadow(0px_0px_10px_rgba(30,215,96,0.7))] transition-all duration-300",
              children: /* @__PURE__ */ jsxs6("svg", { className: "w-8 h-8 sm:w-10 sm:h-10", role: "img", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: [
                /* @__PURE__ */ jsx8("title", { children: "Spotify" }),
                /* @__PURE__ */ jsx8("circle", { cx: "12", cy: "12", r: "12", fill: "currentColor" }),
                /* @__PURE__ */ jsx8("path", { d: "M16.9518 15.0047C16.7842 14.6653 16.3837 14.5303 16.0443 14.6979C13.5421 15.993 10.7295 16.2082 7.95489 15.49C7.57358 15.3819 7.19218 15.614 7.08409 15.9953C6.976 16.3766 7.20808 16.758 7.58939 16.8661C10.7022 17.6712 13.8431 17.4208 16.6736 15.9483C17.013 15.7807 17.1194 15.3441 16.9518 15.0047Z", fill: "white" }),
                /* @__PURE__ */ jsx8("path", { d: "M17.9472 12.0775C17.7158 11.6616 17.2205 11.4786 16.8046 11.71C13.9189 13.2765 10.4087 13.5767 7.44043 12.7016C6.98057 12.5735 6.51955 12.7957 6.39149 13.2556C6.26342 13.7154 6.48563 14.1765 6.94549 14.3045C10.3762 15.293 14.3219 14.9314 17.5773 13.1253C17.9932 12.8938 18.1762 12.3985 17.9472 12.0775Z", fill: "white" }),
                /* @__PURE__ */ jsx8("path", { d: "M18.9534 9.03469C18.6426 8.54862 18.0426 8.32505 17.5565 8.6358C14.2041 10.5517 9.89581 10.6896 6.79599 9.76415C6.26477 9.60806 5.74112 9.85543 5.58503 10.3866C5.42894 10.9179 5.67631 11.4415 6.20753 11.5976C9.77985 12.6455 14.5725 12.4714 18.3472 10.2783C18.8333 9.96757 19.0569 9.36416 18.9534 9.03469Z", fill: "white" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx8(
            "a",
            {
              href: "https://www.youtube.com/channel/UC3dqZkPkJu8ZTW0bA2YuTjQ",
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": "Yung9 on YouTube",
              className: "text-neutral-400 hover:text-[#FF0000] hover:[filter:drop-shadow(0px_0px_10px_rgba(255,0,0,0.7))] transition-all duration-300",
              children: /* @__PURE__ */ jsx8("svg", { className: "w-8 h-8 sm:w-10 sm:h-10", fill: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx8("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }) })
            }
          ),
          /* @__PURE__ */ jsx8(
            "a",
            {
              href: "https://snapchat.com/t/lpAo6DeD",
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": "Yung9 on Snapchat",
              className: "group text-neutral-400 hover:text-[#FFFC00] hover:[filter:drop-shadow(0px_0px_10px_rgba(255,252,0,0.7))] transition-all duration-300",
              children: /* @__PURE__ */ jsx8(
                "img",
                {
                  src: "https://logos-world.net/wp-content/uploads/2020/04/Snapchat-Symbol.png",
                  alt: "Snapchat",
                  className: "w-8 h-8 sm:w-10 sm:h-10 object-contain filter grayscale brightness-[.64] group-hover:filter-none transition-all duration-300",
                  loading: "lazy"
                }
              )
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("section", { className: "container mx-auto px-4 py-10 sm:py-16", children: [
        /* @__PURE__ */ jsx8("h2", { className: "text-3xl sm:text-4xl font-bold text-blue-400 mb-6 text-center tracking-tight [text-shadow:0_0_6px_rgba(96,165,250,0.6)]", children: "Need a Custom Website?" }),
        /* @__PURE__ */ jsxs6("div", { className: "text-center max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsx8("p", { className: "text-neutral-300 text-lg sm:text-xl leading-relaxed mb-8", children: "Interested in a unique website like this? Reach out to get started." }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              type: "button",
              onClick: handleApplyButtonClick,
              className: "inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105",
              "aria-label": "Check application status",
              children: "Click to Apply"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx8("footer", { className: "text-center py-8 text-neutral-500 text-sm", children: /* @__PURE__ */ jsx8("p", { children: "\xA9 2025 Tyler Alexander LLC" }) }),
    showVaultModal && /* @__PURE__ */ jsx8(
      VaultModal_default,
      {
        onClose: handleCloseVaultModal,
        onUnlock: handleUnlockVault
      }
    )
  ] });
};
var App_default = App;

// index.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsx9(React6.StrictMode, { children: /* @__PURE__ */ jsx9(App_default, {}) })
);
