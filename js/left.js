/**
 * RetroTerminal Right
 * Initializes all needed terminal modules in proper sequence
 */

import { init } from './init.js';
import { initCursor } from './terminal/cursor.js';
import { showASCIITasks, gameover } from './terminal/terminal.js';
import { theme, fullscreen, globalListener } from './handlers/globalHandlers.js';
import { initAudio, playGameOver } from './audio/audioManager.js';
import { loadConfig } from './config/configLoader.js';
import { initDOMCache, initDOMTimerLeft } from './utils/domCache.js';
import { initScenario, initTimer, startTimer, stopTimer, setActiveModule, markModuleComplete } from './utils/left_helper.js';

const channel = new BroadcastChannel('mher_sync');

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadConfig();
  } catch (error) {
    console.warn('Continuing with built-in defaults; config.json failed to load.', error);
  }

  init();
  initDOMCache();
  initDOMTimerLeft();
  initCursor();
  initAudio();
});

channel.onmessage = (event) => {
  const { type, payload } = event.data;
  switch (type) {
        case 'SCENARIO_LOADED':
            const ascii = initScenario(payload.tasks);
            showASCIITasks(ascii);
            initTimer(payload.time);
            break;

        case 'TASK_START':
            // startTimer wymaga teraz przekazania funkcji na wypadek Game Over
            startTimer(() => {
                channel.postMessage({ type: 'GAME_OVER' });
            });
            setActiveModule(payload.name);
            break;

        case 'TASK_COMPLETED':
            markModuleComplete(payload.name);
            break;

        case 'GAME_OVER':
            playGameOver();
            gameover();
            break;
            
        case 'VICTORY':
            markModuleComplete("FINAL")
            stopTimer();
            // TODO: logika victory
            break;
  }
};

Object.assign(window, {
  theme,
  fullscreen
});