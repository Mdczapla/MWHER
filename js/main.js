/**
 * RetroTerminal Main Entry Point
 * Initializes all terminal modules in proper sequence
 */

import { init } from './init.js';
import { initCursor } from './terminal/cursor.js';
import { showWelcomeMessage, gameover } from './terminal/terminal.js';
import { handleClick, theme, fullscreen, globalListener } from './handlers/globalHandlers.js';
import { initSettings } from "./config/settings.js";
import { initAudio, stopNarrator, playGameOver } from './audio/audioManager.js';
import { loadConfig } from './config/configLoader.js';
import { initDOMCache } from './utils/domCache.js';

const channel = new BroadcastChannel('mher_sync');

let isGameStarted = false;

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
  if(type === 'INTRO_SKIPPED') {
    stopNarrator();
    document.getElementById('terminal-output').innerHTML = "";
    showWelcomeMessage();
  }else if (type === 'GAME_OVER') {
    playGameOver();
    gameover();
  }
};

// Define some stuff on the window so we can use it directly from the HTML
Object.assign(window, {
  theme,
  handleClick,
  fullscreen
});
