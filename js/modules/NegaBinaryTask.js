import BaseTask from './BaseTask.js';

export class NegaBinaryTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        // Genarating a random x-bit binary string
        this.binaryString = this.generateBinary(config.length || 4);
        this.correctValue = this.calculateNegaBinaryValue(this.binaryString);
    }

    generateBinary(length) {
        return Array.from({length: length}, () => Math.round(Math.random())).join('');
    }

    calculateNegaBinaryValue(binaryStr) {
        return binaryStr.split('').reverse().reduce((acc, bit, index) => {
            return acc + (bit === '1' ? Math.pow(-2, index) : 0);
        }, 0);
    }

    init(){
        super.init();

        let instruction = [
            "[SYSTEM NEGABINARNY]\n",
            `Otrzymałeś ciąg negabinarnego kodu: ${this.binaryString}\n`,
            "Twoim zadaniem jest przeliczenie tego ciągu na wartość dziesiętną.\n",
            "Pamiętaj, że w systemie negabinarnym, bity mają wartości: 1, -2, 4, -8, 16, -32, itd.\n"
        ];
        
        return instruction;
    }

    validate(input) {
        if (parseInt(input) === this.correctValue) {
            this.complete();
            return [true, "Poprawna odpowiedź!"];
        }
        return [false, "Niepoprawna odpowiedź. Spróbuj ponownie."];
    }
}