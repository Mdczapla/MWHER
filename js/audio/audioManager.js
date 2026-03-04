/**
 * Audio Manager Module
 * Manages sound effects with audio pooling to prevent cutoff
 * and handles sequential narration and critical event sounds.
 */

import { AUDIO } from '../config/constants.js';

const SOUND_TYPING = 'assets/sounds/single-key-stroke.mp3';
const SOUND_GAMEOVER = 'assets/sounds/gameover.mp3';
const SOUND_PART1 = 'assets/sounds/narrator/first.mp3';
const SOUND_PART2 = 'assets/sounds/narrator/second.mp3';
const SOUND_PART3 = 'assets/sounds/narrator/third.mp3';
const SOUND_PART4 = 'assets/sounds/narrator/fourth.mp3';
const SOUND_PART5 = 'assets/sounds/narrator/fifth.mp3';

let audioPool = [];
let soundEnabled = true;
let volume = AUDIO.DEFAULT_VOLUME;

let gameOverAudio = null;
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
  
  // game over sound
  if (gameOverAudio) gameOverAudio.volume = volume;
  
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

/**
 * Play the Game Over sequence
 */
export function playGameOver() {
  if (!soundEnabled || !gameOverAudio) return;

  try {
    gameOverAudio.currentTime = 0;
    gameOverAudio.play().catch(e => console.warn('Game Over audio blocked:', e));
  } catch (error) {
    console.warn('Game Over playback error:', error);
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
  }, 10000);
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