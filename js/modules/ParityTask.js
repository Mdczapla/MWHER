import BaseTask from './BaseTask.js';

export class ParityTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.parityBytes = this.generateData(config.bits || 8);
        this.length = config.length || 16;
        this.correctValue = "";
    }

    generateData(bits) {    
        let data = [];

        for (let i = 0; i < this.length - 1; i++) {
            data.push(this.generateBits(bits, true));
        }

        this.correctValue = this.generateBits(bits, false);
        data.push(this.correctValue);
        data.sort(() => Math.random() - 0.5); //losowość danych

        return data
    }

    generateBits(bits, bool) {
        let byteStr = "";
        let onescount = 0;
        for (let i = 0; i < bits - 1; i++) {
            const bit = Math.random() < 0.5 ? '0' : '1';
            if (bit === '1') onescount++;
            byteStr += bit;
        }

        if (bool) {
            byteStr += (onescount % 2 === 0) ? '0' : '1'; //parzystość
        }else {
            byteStr += (onescount % 2 === 0) ? '1' : '0'; //nieparzystość
        }
        return byteStr;

    }

    init() {
        super.init();

        let instruction = [
            "[PARITY CHECK]\n",
            "Otrzymałeś ciąg danych binarnych. Każdy ciąg składa się z 8 bitów, gdzie ostatni bit jest bitem parzystości.\n",
            "Twoim zadaniem jest zidentyfikowanie, który ciąg ma niepoprawny bit parzystości (nieparzysty).\n"
        ];

        this.parityBytes.forEach((byte, index) => {
            instruction.push(`0x0${index + 1}: ${byte}\n`);
        });

        instruction.push("Zidentyfikuj i wpisz uszkodzony ciąg binarny.\n");

        return instruction;
    }

    validate(input) {
        if (input.trim() === this.correctValue) {
            this.complete();
            return [true, "Poprawna odpowiedź!"];
        }else {
            return [false, "Niepoprawna odpowiedź. Spróbuj ponownie."];
        }
    }
}