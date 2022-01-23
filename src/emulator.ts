import {Parser} from "./parser.js";
interface Emulator {

    memory: number[]
    inputs: number[];
    outputs: number[];
    parser: Parser;
    
    execHead: number;
    inputHead: number;
    outputHead: number;
    debugConsole: string[];
    breakpoints: number[];
    intervalId: ReturnType<typeof setInterval>;
}
class Emulator {


    init(program: string, inputs: number[], breakpoints: number[] = []): boolean {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.parser= new Parser(program);
        this.breakpoints = breakpoints;

        // check if all tokens could be generated properly
        let foundInvalidStatements = this.parser.contents.some(element => typeof element === "undefined")
        if (foundInvalidStatements){
            // load all messagesparser's console
            this.parser.debugConsole.forEach((message: string) => {
                this.debugConsole.push(message);
            });
            return false;
        }

        this.parser.mapLabels();
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