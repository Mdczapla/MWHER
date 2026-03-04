import BaseTask from './BaseTask.js';

export class XorTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.keyLength = config.keyLength || 8;

        this.data = this.generateData(this.keyLength);
        this.correctKey = this.generateData(this.data);

        this.correctValue = this.applyXor(this.data, this.correctKey);
    }

    generateData(length) {
        let data = "";
        for (let i = 0; i < length; i++) {
            data += Math.random() < 0.5 ? '0' : '1';
        }
        return data;
    }

    applyXor(data, key) {
        let result = "";
        for (let i = 0; i < data.length; i++) {
            result += (data[i] === key[i]) ? '0' : '1';
        }
        return result;
    }

    init() {
        super.init();
        let instruction = [
            "[MODUŁ KRYPTOGRAFICZNY: XOR]\n",
            "Otrzymałeś zaszyfrowany ciąg binarny, który został przekształcony za pomocą operacji XOR z kluczem.\n",
            `ZASZYFROWANY CIĄG: ${this.correctValue}\n`,
            "Twoim zadaniem jest odgadnięcie klucza, który został użyty do zaszyfrowania danych.\n",
            `Długość klucza: ${this.keyLength} bitów\n`,
            "Podaj klucz jako ciąg binarny, np: '10101010'\n"
        ];
        return instruction;
    }

    validate(input) {
        if (input.trim() === this.correctKey) {
            this.complete();
            return [true, "Klucz poprawny! Dane odszyfrowane pomyślnie."];
        } else {
            return [false, "Niepoprawny klucz. Spróbuj ponownie."];
        }
    }
}
