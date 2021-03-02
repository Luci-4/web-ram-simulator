import {Lexer} from "./lexer.js";

class App {
    memory: number[]
    inputs: number[];
    outputs: number[];
    lexer: Lexer;
    
    execHead: number;
    inputHead: number;
    outputHead: number;
    debugConsole: string[];


    init(program: string, inputs: number[]): boolean {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.lexer = new Lexer(program);

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

    run(program: string, inputs: number[]) {

        // check if there were errors during init
        if (!this.init(program, inputs)){
            
            return 1;
        }
        while(this.execHead < this.lexer.programLength){
            let currentStatement = this.lexer.contents[this.execHead];
            if (!currentStatement.execute(this)){
                console.log("execution stopped with code 1");
                return 1;
            }
            
        }
        console.log("execution stopped with code 0");
        return 0;
        
    }
}

export {App};
// let app: App = new App()
// let program: string = "asdfafdsgdfgadsfg asdfag asdfg asdfg\nkasdfjasdf\njsadfa fjasdf\n";
// let inputs: number[] = [2, 4, 3];

// app.run(program, inputs);
