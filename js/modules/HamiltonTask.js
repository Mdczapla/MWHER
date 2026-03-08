import BaseTask from './BaseTask.js';

export class HamiltonTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.graph = config.graphData || {
            "ALPHA":   { "BRAVO": 75, "CHARLIE": 90 },
            "BRAVO":   { "ALPHA": 75, "CHARLIE": 12, "DELTA": 65 },
            "CHARLIE": { "ALPHA": 90, "BRAVO": 12, "DELTA": 110 },
            "DELTA":   { "BRAVO": 65, "CHARLIE": 110 }
        };
        this.startNode = config.startNode || "ALPHA";
        this.optimalPing = config.optimalPing || 167; 
    }

    init() {
        super.init();
        let instruction = [
            "[PROTOKÓŁ SIECIOWY: ROUTING_TSP]\n",
            "WYKRYTO WĘZŁY: \n" + Object.keys(this.graph).join(", "),
            "\nMusisz wyznaczyć trasę najszybszą (najmniejszy całkowity PING), odwiedzając każdy węzeł dokładnie raz.\n",
            "PUNKT STARTOWY: " + this.startNode + "\n",
            "Mapę węzłów szukaj w ukrytych plikach...\n",
            "Podaj trasę w formacie: ALPHA-BRAVO-CHARLIE-DELTA\n"
        ];
        return instruction;
    }

    validate(input) {
        const path = input.toUpperCase().replace(/\s/g, '').split('-');
        const nodesCount = Object.keys(this.graph).length;

        const uniqueNodes = new Set(path);
        if (uniqueNodes.size !== nodesCount || path.length !== nodesCount) {
            return [false, "BŁĄD: Nie wszystkie węzły zostały uwzględnione lub niektóre się powtarzają."];
        }
        if (path[0] !== this.startNode) {
            return [false, `BŁĄD: Trasa musi zaczynać się od węzła ${this.startNode}.`];
        }

        let totalPing = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const currentNode = path[i];
            const nextNode = path[i + 1];

            if (!this.graph[currentNode] || this.graph[currentNode][nextNode] === undefined) {
                return [false, "BŁĄD: Brak bezpośredniego połączenia między " + currentNode + " a " + nextNode + "."];
            }
            
            totalPing += this.graph[currentNode][nextNode];
        }
        
        if (totalPing > this.optimalPing) {
            return [false, `ODRZUCONO: Podana trasa łączy wszystkie węzły, ale ping wynosi ${totalPing}ms. Istnieje szybsza droga.`];
        }

        this.complete();
        return [true, `TRASA OPTYMALNA ZATWIERDZONA! Całkowite opóźnienie: ${totalPing}ms.`];
    }
}