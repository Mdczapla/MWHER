import { writeToTerminal } from '../handlers/inputHandler.js';
import { processCommand } from '../terminal/terminal.js';
import { HamiltonTask } from './HamiltonTask.js';
import { NegaBinaryTask } from './NegaBinaryTask.js';
import { AsciiTask } from './AsciiTask.js';
import { SqlTask } from './SqlTask.js';
import { FinalTask } from './FinalTask.js';
import { MatrixTask } from './MatrixTask.js';
import { ParityTask } from './ParityTask.js';
import { HexTask } from './HexTask.js';
import { XorTask } from './XorTask.js';

export class TaskManager {
    constructor() {
        this.tasks = {};
        this.time = null;
        this.diff = null;
        this.currentTaskId = null;
        this.channel = new BroadcastChannel('mher_sync');
    }

    loadScenario(scenario) {
        this.tasks = scenario.tasks.map(taskSettings => {
            switch (taskSettings.type) {
                case 'hamilton':
                    return new HamiltonTask(taskSettings.id, taskSettings.type, taskSettings.config)
                case 'negabinary':
                    return new NegaBinaryTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'ascii':
                    return new AsciiTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'sql':
                    return new SqlTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'final_exec':
                    return new FinalTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'matrix':
                    return new MatrixTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'parity':
                    return new ParityTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'hex':
                    return new HexTask(taskSettings.id, taskSettings.type, taskSettings.config);
                case 'xor':
                    return new XorTask(taskSettings.id, taskSettings.type, taskSettings.config);
                default:
                    console.error(`Unknown task type: ${taskSettings.type}`);
                    return null;
            }
        });
        processCommand("clear");
        this.time = scenario.time;
        this.diff = scenario.diff;
        this.currentTaskId = 0;
        console.log(`Scenario loaded with ${this.tasks.length} tasks.`);

        const tasksPayload = this.tasks.map(t => ({ 
            name: t ? t.name : "Unknown Task",
            txt: t ? t.constructor.name : "UnknownTxt",
        }));

        this.channel.postMessage({ 
            type: 'SCENARIO_LOADED', 
            payload: {
                diff: this.diff,
                tasks: tasksPayload,
                time: this.time
            }   
        });

        console.log(`Sent scenario data to LEFT:`, tasksPayload);
        // todo: delay
        if(this.startCurrentTask()){
            console.log(`Task loaded: ${this.getCurrentTask() ? this.getCurrentTask().name : "Unknown Task"}`);
        }
        
    }

    getCurrentTask() {
        return this.tasks[this.currentTaskId];
    }

    getCurrentTaskDescription(){
        return this.tasks[this.currentTaskId].init()
    }
    startCurrentTask() {
        const task = this.getCurrentTask();
        if (task) {
            this.channel.postMessage({
                type: 'TASK_START',
                payload: {
                    name: task.name
                }
            });
            setTimeout(() => writeToTerminal(task.init()), 1000);
            return "Task started: " + task.name;
        } else {
            return ["Brak zadań do rozpoczęcia."];
        }
    }

    startNextTask() {
        if (this.currentTaskId >= this.tasks.length - 1) {
            this.channel.postMessage({
                type: 'VICTORY',
            });
            console.log(`Wszystkie zadania ukończone!`);
            return "koniec scenariusza";
        }
        this.currentTaskId++;
        return this.startCurrentTask();
    }

    processInput(input) {
        const task = this.getCurrentTask();
        if (!task) {
            return false;
        }

        if(!input){
            const result = task.init().join('');
            return result;
        }

        if(input === "shutdown.exe" && this.currentTaskId !== this.tasks.length - 1) {
            return "[ODMOWA DOSTĘPU]: Wykryto aktywne moduły zabezpieczające. Przełam wszystkie węzły systemu przed inicjalizacją zamknięcia."
        }
        
        const isCorrect = task.validate(input);

        if (isCorrect[0]) {  
            this.channel.postMessage({
                type: 'TASK_COMPLETED',
                payload: {
                    name: task.name,
                }
            });

            console.log(`Odpowiedź: ${input}} Poprawna. Przechodzę do następnego zadania.`);
            console.log(this.startNextTask());
            return isCorrect[1];
        }

        this.channel.postMessage({
            type: 'TASK_FAILED'
        })
        console.log(`Odpowiedź: ${input}} Niepoprawna.`);
        return isCorrect[1];
    }
}