/**
 * Input Handler Module
 * Processes keyboard input, command history, and autocomplete
 */

import { processCommand, animateText, processScenario } from '../terminal/terminal.js';
import { scrollToBottom } from './utils.js';
import { playTypingSound } from '../audio/audioManager.js';
import {
  getTextContent,
  setTextContent,
  clearInput,
  insertCharAtCursor,
  deleteCharBeforeCursor,
  deleteCharAtCursor,
  moveCursorLeft,
  moveCursorRight,
  moveCursorToStart,
  moveCursorToEnd
} from '../terminal/cursor.js';
import { getTerminalOutput, getTerminalInput, getInputPrefix } from '../utils/domCache.js';
import { TaskManager } from '../modules/TaskManager.js';
import { SCENARIO_DEFINITIONS } from '../config/constants.js';
import { resolvePath } from '../modules/VirtualFileSystem.js';


let commandHistory = [];
let commandIndex = -1;

const channel = new BroadcastChannel('mher_sync');

/**
 * Handle keyboard input events
 * @param {KeyboardEvent} event - Keyboard event
 */
export async function handleInput(event) {
  const terminalOutput = getTerminalOutput();
  const terminalInput = event.target;

  event.preventDefault();

  if (event.key === "Enter") {
    handleEnterKey(terminalOutput, terminalInput);
  } else if (event.key === "ArrowUp") {
    handleArrowUp();
  } else if (event.key === "ArrowDown") {
    handleArrowDown();
  } else if (event.key === "ArrowLeft") {
    if (event.ctrlKey || event.metaKey) {
      moveCursorToStart();
    } else {
      moveCursorLeft();
    }
  } else if (event.key === "ArrowRight") {
    if (event.ctrlKey || event.metaKey) {
      moveCursorToEnd();
    } else {
      moveCursorRight();
    }
  } else if (event.key === "Home") {
    moveCursorToStart();
  } else if (event.key === "End") {
    moveCursorToEnd();
  } else if (event.key === "Backspace") {
    deleteCharBeforeCursor();
    playTypingSound();
  } else if (event.key === "Delete") {
    deleteCharAtCursor();
    playTypingSound();
  } else if (event.key === "Escape") {
    handleEscape();
  } else if (event.key === "Tab") {
    handleTab();
  } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    insertCharAtCursor(event.key);
    playTypingSound();
  }
}

const manager = new TaskManager();
let introSkipped = false; // Flag to track if intro has been skipped
let scenarioSelected = false; // Flag to track if a scenario has been selected

export function processTaskInput(argument) {
    return manager.processInput(argument);
}
/**
 * Handle Enter key - execute command
 * @param {HTMLElement} terminalOutput - Output container
 * @param {HTMLElement} terminalInput - Input element
 */
async function handleEnterKey(terminalOutput, terminalInput) {
  const inputText = getTextContent().trim();
  let outputText = null;
  if (!introSkipped) {
    outputText = "Intro Skipped";
    channel.postMessage({
      type: 'INTRO_SKIPPED',
    });
    introSkipped = true;
  }else if (!scenarioSelected && introSkipped) { 
    const response = processScenario(inputText);
    if (response) {
      manager.loadScenario(SCENARIO_DEFINITIONS[parseInt(response)]);
      scenarioSelected = true;
    } else {
      outputText = 'Nieznana komenda: Proszę wybrać scenariusz wpisując np. "1".';
    }
  } else {
      outputText = processCommand(inputText);
  }

  if (outputText) {
    const newOutputLine = document.createElement("div");
    terminalOutput.appendChild(newOutputLine);

    commandHistory.push(inputText);
    commandIndex = commandHistory.length;

    if (inputText.length > 0) {
      clearInput();
      terminalOutput.appendChild(newOutputLine);

      const inputPrefix = getInputPrefix();
      await animateText(newOutputLine, inputPrefix.textContent, 10, terminalInput, inputPrefix);
    }
    await animateText(newOutputLine, outputText, 10, terminalInput);
    scrollToBottom();
  }


  clearInput();
  terminalInput.focus();
}

export async function writeToTerminal(text) {
    const terminalInput = getTerminalInput();
    const terminalOutput = getTerminalOutput();

    const newOutputLine = document.createElement("div");
    terminalOutput.appendChild(newOutputLine);

    if (text.length > 0) {
      clearInput();
      terminalOutput.appendChild(newOutputLine);

      const inputPrefix = getInputPrefix();
      await animateText(newOutputLine, inputPrefix.textContent, 10, terminalInput, inputPrefix);
    }
    await animateText(newOutputLine, text, 10, terminalInput);
    scrollToBottom();

  clearInput();
  terminalInput.focus();
}


/**
 * Handle Arrow Up - navigate command history backwards
 */
function handleArrowUp() {
  if (commandIndex > 0) {
    commandIndex--;
    setTextContent(commandHistory[commandIndex]);
    moveCursorToEnd();
  }
}

/**
 * Handle Arrow Down - navigate command history forwards
 */
function handleArrowDown() {
  if (commandIndex < commandHistory.length - 1) {
    commandIndex++;
    setTextContent(commandHistory[commandIndex]);
    moveCursorToEnd();
  } else if (commandIndex === commandHistory.length - 1) {
    commandIndex++;
    clearInput();
  }
}

/**
 * Handle Escape - clear input
 */
function handleEscape() {
  clearInput();
}

/**
 * Handle Tab - autocomplete command
 */
function handleTab() {
  const inputText = getTextContent().trim();
  const suggestions = getAutocompleteSuggestions(inputText);

  if (suggestions.length === 1) {
    setTextContent(suggestions[0]);
    moveCursorToEnd();
  } else if (suggestions.length > 1) {
    console.log("Suggestions:", suggestions.join(", "));
  }
}

/**
 * Get autocomplete suggestions for input text
 * @param {string} inputText - Current input text
 * @returns {string[]} Array of matching commands
 */
function getAutocompleteSuggestions(inputText) {
  if (!inputText) return [];

  const input = inputText.toLowerCase();
  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  const argument = parts.length > 1 ? parts[1] : "";

  if (parts.length === 1 && !inputText.endsWith(" ")) {
    const availableCommands = ["cd", "open", "close", "task", "help", "clear", "tutorial"];
    return availableCommands.filter(cmd => cmd.startsWith(command));
  }

  if (command === "cd" || command === "open") {
    const lastSlashIndex = argument.lastIndexOf('/');
    const basePath = lastSlashIndex !== -1 ? argument.substring(0, lastSlashIndex + 1) : "";
    const fragment = lastSlashIndex !== -1 ? argument.substring(lastSlashIndex + 1) : argument;

    let searchNode = resolvePath();
    
    if (basePath) {
        const targetNode = getNodeByPathRelative(basePath); 
        if (!targetNode || targetNode.type !== 'dir') return [];
        searchNode = targetNode;
    }

    if (!searchNode || !searchNode.children) return [];

    const entries = Object.keys(searchNode.children);
    
    return entries
      .filter(name => {
        const child = searchNode.children[name];
        const isMatch = name.toLowerCase().startsWith(fragment.toLowerCase());
        const isVisible = !child.hidden;
        if (command === "cd") return child.type === 'dir' && isMatch && isVisible;
        if (command === "open") return child.type !== 'dir' && isMatch && isVisible;
        return isMatch && isVisible;
      })
      .map(name => `${command} ${basePath}${name}`);
  }

  return [];
}

/**
 * Helper function for autocomplete
 */
function getNodeByPathRelative(path) {
    const parts = path.split('/').filter(p => p && p !== '.');
    let currentNode = path.startsWith('/') ? fileTree : resolvePath();
    for (const part of parts) {
        if (part === '..') {
            continue;
        }
        if (currentNode.children && currentNode.children[part]) {
            currentNode = currentNode.children[part];
        } else {
            return null;
        }
    }
    return currentNode;
}
