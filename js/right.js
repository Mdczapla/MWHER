/**
 * RetroTerminal Right
 * Initializes all needed terminal modules in proper sequence
 */

import { init } from './init.js';
import { initCursor } from './terminal/cursor.js';
import { showCurrentDirectory, handleFileVisualization, closeImageViewer, gameover, endSession } from './terminal/terminal.js'
import { theme, fullscreen } from './handlers/globalHandlers.js';
import { initAudio } from './audio/audioManager.js';
import { loadConfig } from './config/configLoader.js';
import { initDOMCache } from './utils/domCache.js';

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
});

channel.onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'TASK_COMPLETED':
    case 'COMMAND_CD':
    case 'SCENARIO_LOADED':
      setTimeout(() => {
        document.getElementById('terminal-output').innerHTML = "";
        showCurrentDirectory();
      }, 100);
      break;
    case 'OPEN_FILE':
      handleFileVisualization(payload);
      break;
    case 'CLOSE_FILE':
      document.getElementById('terminal-output').innerHTML = "";
      showCurrentDirectory();
      closeImageViewer();
      break;   
    case 'GAME_OVER':
      gameover();
      break;
    case 'CHANGE_THEME':
      applyTheme(payload.theme);
      break; 
    case 'SHUTDOWN':
      endSession();
      break;
  }
};

// Define some stuff on the window so we can use it directly from the HTML
Object.assign(window, {
  theme,
  fullscreen
});
