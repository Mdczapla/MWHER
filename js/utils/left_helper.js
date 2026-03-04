/**
 * Left terminal helper functions
 */
import { getTerminalTimer } from './domCache.js';

let timerInterval;
let currentAsciiState = ""; // DODANE: Trzymamy pełny tekst ASCII w pamięci

// === INICJALIZACJA ===

export function initScenario(tasks) {
    // Zapisujemy wygenerowany tekst do naszej globalnej zmiennej
    currentAsciiState = generateTaskChainASCII(tasks);
    return currentAsciiState;
}

// === OBSŁUGA STATUSÓW ASCII ===

function updateAsciiStatus(taskName, newStatus) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput || !currentAsciiState) return;

    // Pobieramy nazwę, którą otrzymaliśmy z payloadu (np. "sql" lub "sqltask")
    const searchName = taskName.toUpperCase();
    
    // Szukamy linijki zaczynającej się od [WAIT] lub [RUN ], gdzie pojawia się nasza nazwa
    // (.*) pozwala zignorować, czy dalej jest napisane "TASK", czy same spacje
    const regex = new RegExp(`\\[(WAIT|RUN )\\] MOD: ${searchName}(.*)`, 'g');
    
    currentAsciiState = currentAsciiState.replace(regex, (match, p1, p2) => {
        // match to cała znaleziona linijka, p1 to (WAIT|RUN ), p2 to to, co jest po nazwie
        return `[${newStatus}] MOD: ${searchName}${p2}`;
    });

    if (terminalOutput.innerText !== undefined) {
        terminalOutput.innerText = currentAsciiState;
    } else {
        terminalOutput.textContent = currentAsciiState;
    }
}

export function setActiveModule(taskName) {
    updateAsciiStatus(taskName, "RUN ");
}

export function markModuleComplete(taskName) {
    updateAsciiStatus(taskName, "OK  ");
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

    let ascii = 'INICJALIZACJA PROTOKOŁU...\n\n';

    tasks.forEach((task, index) => {
        const isLast = index === tasks.length - 1;
        const taskName = (task.txt || task.name).toUpperCase().substring(0, 14).padEnd(14, ' ');

        ascii += `  +----------------------------+\n`;
        ascii += `  | [WAIT] MOD: ${taskName} |\n`;
        ascii += `  +----------------------------+\n`;

        if (!isLast) {
            ascii += `                |\n`;
            ascii += `                V\n`;
        }
    });

    return ascii;
}