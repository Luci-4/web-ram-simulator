import {Lexer} from "./lexer";

export class App {
    memory: number[]
    inputs: number[];
    outputs: number[];
    lexer: Lexer;
    // TODO: move some of those to lexer
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
            console.log(this.debugConsole);
            return 1;
        }
        while(this.execHead < this.lexer.programLength){
            let currentStatement = this.lexer.contents[this.execHead];

            if (!currentStatement.execute(this)){
                console.log(this.debugConsole);
                return 1;
            }
            console.log(this.memory);
            console.log(this.outputs);
            
        }
        return 0;
    }
}


let app: App = new App()
let program: string = "read 1\nread 2\nread 3\nload 1\nsub 2\nsub 3\nwrite 0\n";
let inputs: number[] = [2, 4, 3];

app.run(program, inputs);
// console.log(app.lexer.contents);
console.log(app.memory);
console.log(app.outputs);
console.log("CONSOLE:");
console.log(app.debugConsole);
// app.run(program, memory, inputs);