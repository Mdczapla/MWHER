export default class BaseTask {
    constructor(id, name, config = {}) {
        this.id = id;
        this.name = name;
        this.config = config;
        this.isCompleted = false;

        this.channel = new BroadcastChannel('mher_sync');
    }

    complete() {
        this.isCompleted = true;
        console.log(`Zadanie ${this.id} ukończone!`);
        this.channel.postMessage({
            type: 'TASK_COMPLETED',
            payload: { name: this.name } 
        });
    }
    
    // Metoda wywoływana przy ładowaniu zadania na ekran
    init() {
        console.log(`Zadanie "${this.name}" zainicjalizowane.`);
    }

    // Każde zadanie nadpisze tę metodę własną logiką sprawdzania
    validate(input) {
        throw new Error("Metoda validate(input) musi być zaimplementowana w klasie pochodnej!");
    }
    
}