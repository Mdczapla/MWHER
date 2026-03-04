import BaseTask from './BaseTask.js';

export class AsciiTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);

        this.chars = config.chars || 'HOPE';
        this.targetAscii = this.chars.split('').map(c => c.charCodeAt(0));
    }

    init() {
        super.init();
        let instruction = [
            "[KOD ASCII]\n",
            "Twoim zadaniem jest przetłumaczenie podanego ciągu znaków na odpowiadające im wartości ASCII.\n",
            `ZNAKI: ${this.chars}\n`,
            "Podaj odpowiedź jako ciąg liczb oddzielonych spacjami, np: '72 73 74 75'\n"
        ];
        return instruction;
    }

    validate(input) {
        const userAscii = input.trim().split(/\s+/).map(Number);
        if (userAscii.length !== this.targetAscii.length) {
            return [false, `[ASCII FAILURE] Nieprawidłowa liczba wartości. Oczekiwano ${this.targetAscii.length}, otrzymano ${userAscii.length}.`];
        }
        for (let i = 0; i < this.targetAscii.length; i++) {
            if (userAscii[i] !== this.targetAscii[i]) {
                return [false, `[ASCII FAILURE] Nieprawidłowa wartość ASCII dla znaku '${this.chars[i]}'.`];
            }
        }
        this.complete();
        return [true, `Wykonano pomyślnie.\nWynik: ${userAscii.join(' ')}\n Zapamiętaj go!`];
    }
}