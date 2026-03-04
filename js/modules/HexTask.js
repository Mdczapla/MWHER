import BaseTask from './BaseTask.js';

export class HexTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.mode = config.mode || 'full-word';

        const words = {
            'single-char': ['H', 'A', 'C', 'K', 'E', 'R', 'S', 'Y', 'T', 'M'],
            'full-word': ['HACKER', 'ESCAPE', 'ROOM', 'PUZZLE', 'CHALLENGE', 'KERNEL', 'BINARY', 'BYTE', 'STACK', 'OVERFLOW']
        };

        const wordList = words[this.mode] || words['full-word'];
        this.correctStr = wordList[Math.floor(Math.random() * wordList.length)];
        this.correctHex = this.stringToHex(this.correctStr);
    }

    stringToHex(str) {
        return str.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase()).join(' ');
    }

    init() {
        super.init();
        let instruction = [
            "[PROTOKÓŁ TRANSLACJI: HEX]\n",
            "Przechwycono zaszyfrowany pakiet danych\n",
            `Oto Twój ciąg: ${this.correctHex}\n`,
            "Podaj odpowiedź jako tekst, np: 'A lub BANANA'\n"
        ];
        return instruction;
    }

    validate(input) {
        if (input.trim().toUpperCase() === this.correctStr) {
            this.complete();
            return [true, "Pakiet odszyfrowany pomyślnie."];
        } else {
            return [false, "Niepoprawna odpowiedź. Spróbuj ponownie."];
        }
    }

}