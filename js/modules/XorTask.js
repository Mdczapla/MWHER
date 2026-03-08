import BaseTask from './BaseTask.js';

export class XorTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.keyLength = config.keyLength || 8;

        this.data = this.generateData(this.keyLength);
        this.correctKey = this.generateData(this.keyLength);
        this.hiddenValue = this.negabinaryToDecimal(this.data)
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

    negabinaryToDecimal(negabinStr) {
    let decimal = 0;
    let length = negabinStr.length;

    for (let i = 0; i < length; i++) {
        let bit = parseInt(negabinStr[length - 1 - i]);
        if (bit === 1) {
            decimal += Math.pow(-2, i);
        }
    }
    return decimal;
}

    init() {
        super.init();
        let instruction = [
            "[MODUŁ KRYPTOGRAFICZNY: BRAMKA XOR]\n",
            "Otrzymałeś zaszyfrowany ciąg binarny, który został przekształcony za pomocą operacji XOR z tajnym kluczem.\n",
            `ZASZYFROWANY CIĄG: ${this.correctValue}\n`,
            "Twoim zadaniem jest odgadnięcie klucza, który został użyty do zaszyfrowania danych.\n",
            `WSKAZÓWKA - oryginalne dane mają wartość dziesiętną: ${this.hiddenValue} (zakodowane negabinarnie)\n`,
            "Podaj klucz jako ciąg binarny, np: task 10101010\n"
        ];
        return instruction;
    }

    validate(input) {
        console.log(`Wartość: ${input.trim()}, Oczekiwana: ${this.correctKey}`);
        if (input.trim() === this.correctKey) {
            this.complete();
            return [true, "Klucz poprawny! Dane odszyfrowane pomyślnie."];
        } else {
            return [false, "Niepoprawny klucz. Spróbuj ponownie."];
        }
    }
}
