import { playNarrator } from '../audio/audioManager.js';
import { showIntroMessage } from '../terminal/terminal.js';
import { scrollToBottom } from './utils.js';

let isGameStarted = false;

export function handleClick(event) {
  // Prevent default to completely disable mouse caret placement
  // Old terminals only allow keyboard navigation
  if (!isGameStarted) {
    playNarrator();
    showIntroMessage();
    isGameStarted = true;
  }

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

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
