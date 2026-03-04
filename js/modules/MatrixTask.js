import BaseTask from './BaseTask.js';

export class MatrixTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.size = config.size || 2;
        this.matrix = this.generateMatrix(this.size);
        this.correctValue = this.calculateDeterminant(this.matrix);
    }


    generateMatrix(size) {
        let matrix = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(Math.floor(Math.random() * 10));
            }
            matrix.push(row);
        }
        return matrix;
    }

    calculateDeterminant(matrix) {
        if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }else if (matrix.length === 3) {
            return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                   matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                   matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        }

        return null; // For unsupported sizes
    }
    init (){
        super.init();

        let instruction = [
            "[MACIERZ]\n",
            `Otrzymałeś macierz ${this.size}x${this.size}:\n`,
            this.matrix.map(row => row.join(' ')).join('\n'),
            "Twoim zadaniem jest obliczenie wyznacznika tej macierzy.\n"
        ];

        return instruction;
    }

    validate(input) {

        if (parseInt(input) === this.correctValue) {
            this.complete();
            return [true, `Poprawna odpowiedź: ${this.correctValue}`];
        } else {
            return [false, `Niepoprawna odpowiedź. Spróbuj ponownie.`];
        }
    }
    
}
