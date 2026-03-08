/**
 * Left terminal helper functions
 */
import { playRadarSound, stopRadarSound } from '../audio/audioManager.js';
import { showServersMap } from '../terminal/terminal.js';
import { getTerminalTimer, getTerminalOutput, getTerminal } from './domCache.js';

let timerInterval;
let refreshTimeout;
let isRefreshActive = false;
let currentAsciiState = "";

// === INICJALIZACJA ===

export function initScenario(tasks) {
    currentAsciiState = generateTaskChainASCII(tasks);
    return currentAsciiState;
}

export function getCurrentAsciiState(){
    return currentAsciiState;
}

export function startRefreshTimeout(){
    if(isRefreshActive) return;
    isRefreshActive = true;
    async function refresh(){
        if(!isRefreshActive) return;
        playRadarSound();
        await showServersMap();
        stopRadarSound();
        const terminalOutput = getTerminalOutput();
        if(terminalOutput && isRefreshActive){
            terminalOutput.style.opacity = '0.3';
            await new Promise(resolve => setTimeout(() => {
                if (terminalOutput) terminalOutput.style.opacity = '1';
                resolve();
            }, 300));
        }

        if (refreshTimeout) clearTimeout(refreshTimeout);
        if (isRefreshActive) {
            refreshTimeout = setTimeout(refresh, 5000);
        }
    }
    refresh();
}

export function stopRefreshTimeout(){
    isRefreshActive = false;
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
    }
}

// === OBSŁUGA STATUSÓW ASCII ===

function updateAsciiStatus(taskName, newStatus) {
    if (!currentAsciiState) return;

    const cleanName = taskName.toUpperCase().trim();
    const searchPart = cleanName.substring(0, 10);
    
    const paddedStatus = newStatus.padEnd(7, ' ');
    const formattedName = cleanName.substring(0, 15).padEnd(15, ' ');
    const newLine = `  | [${paddedStatus}] MOD: ${formattedName} |`;

    const regex = new RegExp(`^\\s*\\| \\[.*?\\] MOD: ${searchPart}.*?\\|$`, 'gm');

    currentAsciiState = currentAsciiState.replace(regex, newLine);
}

export function setActiveModule(taskName) {
    updateAsciiStatus(taskName, "RUNNING");
    
    const terminalOutput = getTerminalOutput();
    if (terminalOutput) {
        terminalOutput.textContent = currentAsciiState;
    }
}

export async function markModuleComplete(taskName) {
    stopRefreshTimeout();

    const cleanName = taskName.toUpperCase().trim();
    const searchPart = cleanName.substring(0, 10);
    const formattedName = cleanName.substring(0, 15).padEnd(15, ' ');
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const duration = 1200;
    const step = 40;
    let elapsed = 0;
    
    const terminalOutput = getTerminalOutput();

    return new Promise((resolve) => {
        const decryptInterval = setInterval(() => {
            elapsed += step;

            const targetWord = "ONLINE ";
            let scrambled = "";
            const progress = elapsed / duration;

            for (let i = 0; i < 7; i++) {
                if (i < progress * 7) {
                    scrambled += targetWord[i];
                } else {
                    scrambled += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            const regex = new RegExp(`^\\s*\\| \\[.*?\\] MOD: ${searchPart}.*?\\|$`, 'gm');
            const currentLine = `  | [${scrambled}] MOD: ${formattedName} |`;
            
            currentAsciiState = currentAsciiState.replace(regex, currentLine);

            if (terminalOutput) {
                terminalOutput.textContent = currentAsciiState;
            }

            if (elapsed >= duration) {
                clearInterval(decryptInterval);
                updateAsciiStatus(taskName, "ONLINE");
                if (terminalOutput) terminalOutput.textContent = currentAsciiState;
                
                const isAllOnline = !currentAsciiState.includes('[OFFLINE]') && !currentAsciiState.includes('[RUNNING]');
                if(!isAllOnline) startRefreshTimeout();
                
                resolve(isAllOnline);
            }
        }, step);
    });
}

// === OBSŁUGA ZEGARA ===

export function initTimer(time) {
    const timerEl = getTerminalTimer();
    if (timerEl) timerEl.textContent = formatTime(time);
}

export function startTimer(onGameOver) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => updateTimer(onGameOver), 1000);
}

export function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

export function getCurrentTime(){
    const timerEl = getTerminalTimer();
    return timerEl.textContent;
}

function updateTimer(onGameOver) {
    const timerEl = getTerminalTimer();
    if (!timerEl) return;

    const parts = timerEl.textContent.split(':');
    let currentTime = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    
    if (currentTime <= 0) {
        stopTimer();
        if (onGameOver) onGameOver();
        return;
    }
    
    currentTime--;
    timerEl.textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function generateTaskChainASCII(tasks) {
    if (!tasks || tasks.length === 0) return '';

    let ascii = '--------MAPOWANIE_SERWEROW--------\n\n';

    tasks.forEach((task, index) => {
        const isLast = index === tasks.length - 1;
        
        const rawName = (task.txt || task.name).toUpperCase();
        const taskName = rawName.substring(0, 15).padEnd(15, ' ');

        ascii += `  +--------------------------------+\n`;
        ascii += `  | [OFFLINE] MOD: ${taskName} |\n`;
        ascii += `  +--------------------------------+\n`;

        if (!isLast) {
            ascii += `                |\n`;
            ascii += `                V\n`;
        }
    });

    return ascii;
}