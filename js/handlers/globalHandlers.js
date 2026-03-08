import { playBootSound, playNarrator, stopBootSound } from '../audio/audioManager.js';
import { showIntroMessage } from '../terminal/terminal.js';
import { runHexBootSequence } from '../utils/animations.js';
import { getTerminalOutput } from '../utils/domCache.js';
import { scrollToBottom } from './utils.js';

let isGameStarted = false;
let isBooting;
export async function handleClick(event) {
  // Prevent default to completely disable mouse caret placement
  // Old terminals only allow keyboard navigation

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!isGameStarted && !isBooting) {
    isBooting = true;

    const terminalOutput = getTerminalOutput();
    if (terminalOutput) {
      playBootSound();
      runHexBootSequence(terminalOutput)
        .then(() => {
          stopBootSound();
          return new Promise(resolve => setTimeout(resolve, 1000));
        })
        .then(() => {
          stopBootSound();
          playNarrator();
          showIntroMessage();
          isGameStarted = true;
        })
        .catch((error) => {
          console.error("[MHER OS] Błąd sekwencji startowej:", error);
          stopBootSound();
          playNarrator();
          showIntroMessage();
          isGameStarted = true;
        })
        .finally(() => {
          isBooting = false;
        });
    } else {
      isBooting = false;
    }
  }

  if (isBooting) return;

  const input = document.getElementById("terminal-input");
  if (!input) return;

  input.focus();
  
  // Clear any browser selection
  window.getSelection()?.removeAllRanges();

  const terminalOutput = document.getElementById("terminal-output");
  if (terminalOutput) {
    const isScrolledToBottom =
      terminalOutput.scrollHeight - terminalOutput.clientHeight <=
      terminalOutput.scrollTop + 1;

    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }
}

export function theme(event) {
  const themeName = event.target.dataset.theme;
  document.querySelectorAll(".theme").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  document.body.className = "theme-" + themeName;
  handleClick();
}

export function fullscreen(event) {
  event.target.blur();
}

export function globalListener(event) {
  if (event.key === "F11") {
    toggleFullscreen();
  } else if (event.key === "Escape") {
    toggleFullscreen(false);
  }
}

export function toggleFullscreen(enable) {
  if (enable === undefined) {
    enable = !document.fullscreenElement;
  }

  if (enable) {
    document.documentElement.requestFullscreen?.();
  } else if (document.fullscreenElement) {
    document.exitFullscreen?.();
  }
}
