import { Error_ } from "./exceptions.js";
import {Parser} from "./parser.js";
import { Statement } from "./statement.js";
class Emulator {
    memory: number[];
    inputs: number[];
    outputs: number[];
    debugConsole: string[];
    errors: Error_[];
    parser: Parser;
    breakpoints: number[];
    execHead: number;
    inputHead: number;
    outputHead: number;
    intervalId: ReturnType<typeof setInterval>;

    init(program: string, inputs: number[], breakpoints: number[] = []): boolean {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.errors = [];
        this.parser = new Parser(program);
        this.breakpoints = breakpoints;

        // check if all tokens could be generated properly
        let foundInvalidStatements = this.parser.contents.some((statement: Statement) => !statement.isValid);
        if (foundInvalidStatements){
            // load all messagesparser's console
            this.errors.push(...this.parser.errors);
            this.debugConsole = this.errors.map((e: Error_) => e.generateMessage()) 
            return false;
        }

        this.parser.generateLabelsMap();
        this.execHead = 0;
        this.inputHead = 0;
        this.outputHead = 0;
        return true;

    }

    run() {
        this.intervalId = setInterval(this.step, 500);

    }

    debug(program: string, inputs: number[], breakpoints: number[]){
        if(!this.init(program, inputs, breakpoints)){
            return 1;
        }
    }
    step(){
        if(this.execHead >= this.parser.programLength){
            
            return 0;
        }
        let currentStatement = this.parser.contents[this.execHead];
        
        let result = currentStatement?.execute(this);
        if(!result){
            return 1;
        }
        
    }

    
}

export {Emulator};