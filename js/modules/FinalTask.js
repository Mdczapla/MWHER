import BaseTask from './BaseTask.js';

export class FinalTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.scriptName = config.script || 'shutdown.exe';
    }

    init() {
        super.init();
        return `[SYSTEM ALERT]\n
        WSZYSTKIE ZABEZPIECZENIA ZŁAMANE.\n
        POZOSTAŁO JEDNO POLECENIE.\n\n
        Wpisz: '${this.scriptName}' aby przejąć system.\n`;
    }

    validate(input) {
        if (input.trim() === this.scriptName) {
            this.complete();
            this.channel.postMessage({ 
                type: 'VICTORY'
            });
            return [true, "Sukces"];
        }
        return [false, "Nieprawidłowe polecenie. Spróbuj ponownie."];
    }
}