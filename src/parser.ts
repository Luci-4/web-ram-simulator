import {Lexer} from "./lexer.js";

class Parser {
    memory: number[]
    inputs: number[];
    outputs: number[];
    lexer: Lexer;
    
    execHead: number;
    inputHead: number;
    outputHead: number;
    debugConsole: string[];
    breakpoints: number[];
    intervalId: number;


    init(program: string, inputs: number[], breakpoints=[]): boolean {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.lexer = new Lexer(program);
        this.breakpoints = breakpoints;

        // check if all tokens could be generated properly
        let foundInvalidStatements = this.lexer.contents.some(element => typeof element === "undefined")
        if (foundInvalidStatements){
            // load all messages from lexer's console
            this.lexer.debugConsole.forEach((message: string) => {
                this.debugConsole.push(message);
            });
            return false;
        }

        this.lexer.mapLabels();
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
        if(this.execHead >= this.lexer.programLength){
            
            return 0;
        }
        let currentStatement = this.lexer.contents[this.execHead];
        
        let result = currentStatement.execute(this);
        if(!result){
            return 1;
        }
        
    }

    
}

export {Parser};