import { scrollToBottom } from "../handlers/utils.js";
import { getTerminalWrapper } from "./domCache.js";

export function triggerTerminalGlitch() {
    const element = getTerminalWrapper();
    element.classList.add('system-glitch');

    setTimeout(() => {
        element.classList.remove('system-glitch');
    }, 300);
}

export async function runHexBootSequence(terminalOutputElement) {
    return new Promise(resolve => {
        let lines = 0;
        terminalOutputElement.innerHTML = "";
        
        const hexInterval = setInterval(() => {
            const memoryAddress = '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
            let hexRow = '';
            for(let i = 0; i < 8; i++) {
                hexRow += Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0') + ' ';
            }
            const lineDiv = document.createElement('div');
            lineDiv.textContent = `[MEM_TEST] ${memoryAddress} : ${hexRow}  OK`;
            terminalOutputElement.appendChild(lineDiv);
            
            terminalOutputElement.scrollTop = terminalOutputElement.scrollHeight;
            lines++;
            scrollToBottom();
            if (lines > 100) {
                clearInterval(hexInterval);
                setTimeout(() => {
                    terminalOutputElement.innerHTML = "";
                    resolve();
                }, 500);
            }
        }, 50);
    });
}

