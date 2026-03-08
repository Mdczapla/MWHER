/**
 * Audio Manager Module
 * Manages sound effects with audio pooling to prevent cutoff
 * and handles sequential narration and critical event sounds.
 */

import { AUDIO } from '../config/constants.js';

const SOUND_TYPING = 'assets/sounds/single-key-stroke.mp3';
const SOUND_GAMEOVER = 'assets/sounds/gameover.mp3';
const SOUND_GLITCH = 'assets/sounds/glitch.mp3';
const SOUND_SUCCESS = 'assets/sounds/success.mp3';
const SOUND_RADAR = 'assets/sounds/radar.mp3';
const SOUND_BOOT = 'assets/sounds/boot.mp3';
const SOUND_POWERDOWN = 'assets/sounds/powerdown.mp3';
const SOUND_VICTORY = 'assets/sounds/victory.mp3';

const SOUND_PART1 = 'assets/sounds/narrator/first.mp3';
const SOUND_PART2 = 'assets/sounds/narrator/second.mp3';
const SOUND_PART3 = 'assets/sounds/narrator/third.mp3';
const SOUND_PART4 = 'assets/sounds/narrator/fourth.mp3';
const SOUND_PART5 = 'assets/sounds/narrator/fifth.mp3';

let audioPool = [];
let soundEnabled = true;
let volume = AUDIO.DEFAULT_VOLUME;

let gameOverAudio = null;
let glitchAudio = null;
let successAudio = null;
let radarAudio = null;
let bootAudio = null;
let powerDownAudio = null;
let victoryAudio = null;

let narratorQueue = [];
let currentNarrationIndex = 0;
let isNarrationActive = false;

/**
 * Create a single audio instance with proper configuration
 * @param {string} src - Path to the audio file
 * @returns {HTMLAudioElement} Configured audio element
 */
function createAudioInstance(src) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.preload = 'auto';
  return audio;
}

/**
 * Ensure audio pool is initialized with configured pool size
 * This is specific for rapid sounds like typing.
 */
function ensurePool() {
  if (audioPool.length === 0) {
    audioPool = Array.from({ length: AUDIO.POOL_SIZE }, () => {
      const audio = createAudioInstance(SOUND_TYPING);
      audio.load();
      return audio;
    });
  }
}

/**
 * Initialize special story audio instances (game over, narrator)
 */
function initSpecialSounds() {
  gameOverAudio = createAudioInstance(SOUND_GAMEOVER);
  glitchAudio = createAudioInstance(SOUND_GLITCH);
  successAudio = createAudioInstance(SOUND_SUCCESS);
  radarAudio = createAudioInstance(SOUND_RADAR);
  radarAudio.loop = true;
  bootAudio = createAudioInstance(SOUND_BOOT);
  bootAudio.loop = true;
  victoryAudio = createAudioInstance(SOUND_VICTORY);
  powerDownAudio = createAudioInstance(SOUND_POWERDOWN);

  narratorQueue = [
    createAudioInstance(SOUND_PART1),
    createAudioInstance(SOUND_PART2),
    createAudioInstance(SOUND_PART3),
    createAudioInstance(SOUND_PART4),
    createAudioInstance(SOUND_PART5)
  ];
}

/**
 * Initialize audio system and expose API to window
 */
export function initAudio() {
  try {
    ensurePool();
    initSpecialSounds();
  } catch (error) {
    console.warn('Failed to initialize audio:', error);
  }

  window.audioManager = {
    setSoundEnabled,
    setVolume,
    getSoundSettings,
    playTypingSound,
    playGameOver,
    playGlitchSound,
    playSuccessSound,
    playRadarSound,
    stopRadarSound,
    playBootSound,
    stopBootSound,
    playPowerDownSound,
    playVictorySound,
    playNarrator,
    stopNarrator
  };
}

/**
 * Enable or disable all sounds
 * @param {boolean} enabled - Whether sounds should be enabled
 */
export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  if (!enabled) {
    stopNarrator();
    if (gameOverAudio) gameOverAudio.pause();
    if (bootAudio) bootAudio.pause();
    if (powerDownAudio) powerDownAudio.pause();
  }
}

/**
 * Set volume level (clamped to valid range) and apply to all audio objects
 * @param {number} newVolume - Volume level (0.0 to 1.0)
 */
export function setVolume(newVolume) {
  volume = Math.max(AUDIO.MIN_VOLUME, Math.min(AUDIO.MAX_VOLUME, newVolume));
  
  // typing pool
  audioPool.forEach(audio => { audio.volume = volume; });
  
  // sound effects
  if (gameOverAudio) gameOverAudio.volume = volume;
  if (glitchAudio) glitchAudio.volume = volume;
  if (successAudio) successAudio.volume = volume;
  if (radarAudio) radarAudio.volume = volume;
  if (bootAudio) bootAudio.volume = volume;
  if (powerDownAudio) powerDownAudio.volume = volume;
  if (victoryAudio) victoryAudio.volume = volume;

  // narrator parts
  narratorQueue.forEach(audio => { audio.volume = volume; });
}

/**
 * Get current sound settings
 * @returns {{soundEnabled: boolean, volume: number}} Current settings
 */

export function getSoundSettings() {
  return { soundEnabled, volume };
}

/**
 * Play typing sound using next available audio instance from pool
 * Uses pooling to prevent sound cutoff on rapid keystrokes
 */
export function playTypingSound() {
  if (!soundEnabled) return;
  ensurePool();

  const audio = audioPool.find(a => a.paused || a.ended);
  if (!audio) return;

  try {
    audio.currentTime = 0;
    audio.play().catch(() => {
    });
  } catch (error) {
    console.warn('Audio playback error:', error);
  }
}

/**
 * Stop the current narration sequence immediately
 */
export function stopNarrator() {
  isNarrationActive = false;
  if (currentNarrationIndex < narratorQueue.length) {
    const currentAudio = narratorQueue[currentNarrationIndex];
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  }
}


// ================Play Sound Effects================

export function playGameOver() {
  if (!soundEnabled || !gameOverAudio) return;

  try {
    gameOverAudio.currentTime = 0;
    gameOverAudio.play().catch(e => console.warn('Game Over audio blocked:', e));
  } catch (error) {
    console.warn('Game Over playback error:', error);
  }
}

export function playGlitchSound() {
  if (!soundEnabled || !glitchAudio) return;
  try {
    glitchAudio.currentTime = 0;
    glitchAudio.play().catch(() => {});
  } catch (error) {}
}

export function playSuccessSound() {
  if (!soundEnabled || !successAudio) return;
  try {
    successAudio.currentTime = 0;
    successAudio.play().catch(() => {});
  } catch (error) {}
}

export function playRadarSound() {
  if (!soundEnabled || !radarAudio) return;
  try {
    radarAudio.currentTime = 0;
    radarAudio.play().catch(() => {});
  } catch (error) {}
}

export function stopRadarSound() {
  if (radarAudio) {
    radarAudio.pause();
    radarAudio.currentTime = 0;
  }
}

export function playBootSound() {
  if (!soundEnabled || !bootAudio) return;
  try {
    bootAudio.currentTime = 0;
    bootAudio.play().catch(() => {});
  } catch (error) {}
}

export function stopBootSound() {
  if (bootAudio) {
    bootAudio.pause();
    bootAudio.currentTime = 0;
  }
}

export function playPowerDownSound() {
  if (!soundEnabled || !powerDownAudio) return;
  try {
    powerDownAudio.currentTime = 0;
    powerDownAudio.play().catch(() => {});
  } catch (error) {}
}

export function playVictorySound() {
  if (!soundEnabled || !victoryAudio) return null;
  try {
    victoryAudio.currentTime = 0;
    victoryAudio.play().catch(() => {});
    return victoryAudio;
  } catch (error) {
    return null;
  }
}

/**
 * Play the sequential narrator parts
 * Triggers parts 1 through 5 automatically one after another
 */
export function playNarrator() {
  if (!soundEnabled || narratorQueue.length === 0 || isNarrationActive) return;
  
  isNarrationActive = true;
  currentNarrationIndex = 0;
  setTimeout(() => {
    playNextNarratorPart();
  }, 2000);
}

/**
 * Internal helper to handle the sequencing of narrator audio files
 */
function playNextNarratorPart() {
  if (!isNarrationActive || currentNarrationIndex >= narratorQueue.length) {
    isNarrationActive = false;
    return;
  }

  const currentAudio = narratorQueue[currentNarrationIndex];
  currentAudio.currentTime = 0;

  currentAudio.onended = () => {
    currentAudio.onended = null; 
    currentNarrationIndex++;
    setTimeout(() => {
      playNextNarratorPart();
    }, 1000)
  };

  currentAudio.play().catch(error => {
    console.warn(`Narrator part ${currentNarrationIndex + 1} blocked by browser:`, error);
    isNarrationActive = false;
  });
}