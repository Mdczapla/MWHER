/**
 * Terminal Core Module
 * Handles command processing, text animation, and welcome message
 */

import { applyTheme } from "../config/settings.js";
import {
	getBanner,
	getHelp,
	getTutorial,
	getGameover,
	getIntro
} from "../config/content.js";
import { 
	processTaskInput
} from "../handlers/inputHandler.js";
import { scrollToBottom } from '../handlers/utils.js';
import { getTerminalOutput, getTerminalInput, getInputPrefix } from '../utils/domCache.js';
import { ANIMATION } from '../config/constants.js';
import { changeDirectory, openFile, closeFile, getTreeStructure } from "../modules/VirtualFileSystem.js";
import { playNarrator } from "../audio/audioManager.js";

/**
 * Display intro on terminal initialization
 */
export async function showIntroMessage() {
	displayMessage(getIntro());
}

/**
 * Display tutorial on terminal initialization
 */
export async function showTutorialMessage() {
	displayMessage(getTutorial());
}
/**
 * Display welcome banner on terminal
 */
export async function showWelcomeMessage() {
	displayMessage(getBanner());
}
/**
 * Display Directory Structure in right.html
 */
export async function showCurrentDirectory(){
	displayMessage(getTreeStructure());
}

/**
 * Display ASCII Task Chain in left.html
 */

export async function showASCIITasks(asciiString){
	displayMessage(asciiString);
}
/**
 * Timer run out
 */
export async function gameover(){
	bricked = true;
	applyTheme("red");
	getTerminalOutput().innerHTML = "";
	displayMessage(getGameover());
}

/**
 * Displays provided message in terminal
 * @param {array of string||string} outputMessage 
 */
async function displayMessage(outputMessage){
	const terminalOutput = getTerminalOutput();
	const newOutputLine = document.createElement("div");
	terminalOutput.appendChild(newOutputLine);
	await animateText(newOutputLine, outputMessage);
	scrollToBottom();
}

let currentImageViewer = null;
/**
 * Displays correct image in right terminal
 * @param {string} imageName
 */
function showImageViewer(imageName){
	if(currentImageViewer){
		closeImageViewer();
	}

	const viewer = document.createElement('div');
	viewer.id = 'terminal-image-viewer';
	viewer.className = 'image-viewer-window';

	viewer.innerHTML = `
    <div class="viewer-header">
      <span class="viewer-title">VIEWING // ${imageName}</span>
      <span class="viewer-close" id="close-viewer-btn">[X]</span>
    </div>
    <div class="viewer-content">
       <img src="./assets/images/${imageName}" alt="Podgląd pliku: ${imageName}" />
    </div>
  	`;

	document.body.appendChild(viewer);
	currentImageViewer = viewer;

	//maybe
	document.getElementById('close-viewer-btn').addEventListener('click', () => {
    	closeImageViewer();
  	});
}

/**
 * Removes image from terminal
 */
export function closeImageViewer() {
  if (currentImageViewer) {
    currentImageViewer.remove();
    currentImageViewer = null;
  }
}

const textTypes = ['txt', 'ini', 'conf', 'log', 'hex', 'enc', 'pem'];
/**
 * Displays provided filedata in terminal
 * @param {string||} fileData 
 */
export async function handleFileVisualization(fileData){
  const { name, type, content } = fileData;
  
  console.log("TERMINAL TYPE: " + type);
  if(textTypes.includes(type)){
	getTerminalOutput().innerHTML = "";
	const formattedText = `\n--- POCZĄTEK PLIKU: ${name} ---\n${content}\n--- KONIEC PLIKU ---\n`;
	console.log("in");
	displayMessage(formattedText);
  }else if (type === 'jpg' || type === 'png') {
    showImageViewer(name);
  } else if (type === 'dbase') {
    // todo: baza danych
	console.log("TERMINAL: DBASE NOT SUPPORTED");
  }
}

/**
 * Changes the input prefix displayed before the user input
 * @param {string} newPrefix 
 * @returns {boolean} True if prefix was successfully changed, false otherwise
 */
function changeInputPrefix(newPrefix) {
	const inputPrefix = getInputPrefix();
	if(inputPrefix) {
		inputPrefix.textContent = newPrefix + " > ";
		console.log(`Input prefix changed to: ${inputPrefix.textContent}`);
		return true;
	}
	console.warn('Input prefix element not found. Cannot change prefix.');
	return false;
}

let bricked = false;
/**
 * Process a command and return the response text
 * @param {string} inputText - Command text entered by user
 * @returns {string} Response text to display
 */
export function processCommand(inputText) {
	const terminalInput = getTerminalInput();
	const userCommand = terminalInput.textContent;
	let response = '';
	let argument = '';

	if(!bricked) {
		switch (inputText.split(" ")[0].toLowerCase()) {
		case "help":
			return userCommand + "\n" + getHelp();
		case "date":
			return userCommand + "\n" + new Date().toLocaleString();
		case "cd":
			argument = userCommand.split(" ").slice(1).join(" ").trim();
			if (!argument) return `Brak argumentu`
			console.log(`{${argument}}`);
			return changeDirectory(argument);
		case "open":
			argument = userCommand.split(" ").slice(1).join(" ").trim();
			let result = openFile(argument);
			if (!result.startsWith('BŁĄD')) getTerminalOutput().innerHTML = "";
			return result;
		case "close":
			closeImageViewer();
			return closeFile();
		case "task":
			argument = userCommand.split(" ").slice(1).join(" ").trim();
			return userCommand + "\n" + processTaskInput(argument);
		case "shutdown.exe":
			return userCommand + "\n" + processTaskInput("shutdown.exe");
		case "theme":
			argument = userCommand.split(" ").slice(1).join(" ").trim();
			if(argument === 'green' || argument === 'orange'){
				applyTheme(argument);
				return userCommand + "\n" + `Wygląd zmieniony na ${argument}.`;
			}
			return "Niewspierany wygląd"
		case "clear":
			getTerminalOutput().innerHTML = "";
			return "";
		case "tutorial":
			return userCommand + "\n" + getTutorial();
		default:
			return userCommand + "\n" + `Nieznana komenda: ${inputText}`;
		}
	}
	return null;
}

export function processScenario(inputText) {
	switch (inputText.toLowerCase()) {
	  case "1":
		return 1;
	  case "2":
		return 2;
	  case "3":
		return 3;
	  case "tutorial":
		return 4;
	  default:
		return 0;
	}
}

let userInteracted = false;
document.addEventListener("click", () => {
	userInteracted = true;
});

/**
 * Calculate animation speed multiplier based on text length
 * Longer text animates faster to improve UX
 * @param {number} textLength - Length of text to animate
 * @returns {number} Speed multiplier
 */
function getSpeedMultiplier(textLength) {
	if (textLength <= ANIMATION.THRESHOLDS.SHORT) {
		return ANIMATION.SPEED_MULTIPLIERS.SHORT;
	} else if (textLength <= ANIMATION.THRESHOLDS.MEDIUM) {
		return ANIMATION.SPEED_MULTIPLIERS.MEDIUM;
	}
	return ANIMATION.SPEED_MULTIPLIERS.LONG;
}


let doonce = true;
/**
 * Animate text character by character with adaptive speed
 * @param {HTMLElement} element - Element to display text in
 * @param {string} text - Text to animate
 * @param {number} delay - Base delay in milliseconds (default from constants)
 * @param {HTMLElement} terminalInput - Optional input element to disable during animation
 * @param {HTMLElement} inputPrefix - Optional prefix element to hide during animation
 */
export async function animateText(element, text, delay = ANIMATION.DELAY_DEFAULT, terminalInput, inputPrefix) {
	if (terminalInput) {
		terminalInput.contentEditable = "false";
		if (inputPrefix) inputPrefix.style.display = "none";
	}
	let speedFactor = 1;
	if(doonce) {
		speedFactor = 0.5;
		doonce = false;
	}
	else speedFactor = getSpeedMultiplier(text.length);

	 
	const adjustedDelay = delay / speedFactor;

	for (const char of text) {
		element.textContent += char;
		scrollToBottom();
		await new Promise((resolve) => setTimeout(resolve, adjustedDelay));
	}

	if (terminalInput) {
		terminalInput.contentEditable = "true";
		if (inputPrefix) inputPrefix.style.display = "inline";
	}
}
