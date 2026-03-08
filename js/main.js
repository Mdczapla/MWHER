/**
 * RetroTerminal Main Entry Point
 * Initializes all terminal modules in proper sequence
 */

import { init } from './init.js';
import { initCursor } from './terminal/cursor.js';
import { showWelcomeMessage, gameover, showASCIITasks, executeShutdown, endSession } from './terminal/terminal.js';
import { handleClick, theme, fullscreen, globalListener } from './handlers/globalHandlers.js';
import { initSettings } from "./config/settings.js";
import { initAudio, stopNarrator, playGameOver, playRadarSound, playGlitchSound, playVictorySound, playPowerDownSound, playSuccessSound } from './audio/audioManager.js';
import { loadConfig } from './config/configLoader.js';
import { initDOMCache } from './utils/domCache.js';
import { triggerTerminalGlitch } from './utils/animations.js';

const channel = new BroadcastChannel('mher_sync');

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadConfig();
  } catch (error) {
    console.warn('Continuing with built-in defaults; config.json failed to load.', error);
  }

  init();
  initDOMCache();
  initCursor();
  initAudio();
  initSettings();
});

document.addEventListener("keydown", globalListener);

channel.onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'INTRO_SKIPPED':
      stopNarrator();
      document.getElementById('terminal-output').innerHTML = "";
      showWelcomeMessage();
      break;
    case 'GAME_OVER':
      playGameOver();
      gameover()
      .then(() => {
        playPowerDownSound();
      })
      .catch((error) => {
        console.error("[main.js] Błąd dźwięku boot:", error);
      });
      break;
    case 'CHANGE_THEME':
      applyTheme(payload.theme);
      break;
    case 'TASK_COMPLETED':
      playSuccessSound();
      break;
    case 'TASK_FAILED':
      triggerTerminalGlitch();
      playGlitchSound();
      break;
    case 'REFRESH':
      playRadarSound();
      break;
    case 'VICTORY':
      document.getElementById('terminal-output').innerHTML = "";
      executeShutdown();
      const sound = playVictorySound();
      if (sound) {
        sound.onended = () => {
          channel.postMessage({
            type: 'SHUTDOWN'
          })
          playPowerDownSound();
          endSession();
        }
      }else {
        endSession();
      }
      break;

  }  
};

// Define some stuff on the window so we can use it directly from the HTML
Object.assign(window, {
  theme,
  handleClick,
  fullscreen
});
