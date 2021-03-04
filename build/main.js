import { Lexer } from "./lexer.js";
class App {
    init(program, inputs, breakpoints = []) {
        console.log("in init");
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.lexer = new Lexer(program);
        this.breakpoints = breakpoints;
        // check if all tokens could be generated properly
        let foundInvalidStatements = this.lexer.contents.some(element => typeof element === "undefined");
        if (foundInvalidStatements) {
            // load all messages from lexer's console
            this.lexer.debugConsole.forEach((message) => {
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
        // check if there were errors during init
        // if (!this.init(program, inputs)){
        //     return 1;
        // }
        // while(this.execHead < this.lexer.programLength){
        //     let currentStatement = this.lexer.contents[this.execHead];
        //     if (!currentStatement.execute(this)){
        //         console.log("execution stopped with code 1");
        //         return 1;
        //     }
        // }
        this.intervalId = setInterval(this.step, 500);
    }
    delay() {
    }
    debug(program, inputs, breakpoints) {
        if (!this.init(program, inputs, breakpoints)) {
            return 1;
        }
    }
    step() {
        if (this.execHead >= this.lexer.programLength) {
            console.log("In app.step program ended");
            return 1;
        }
        let currentStatement = this.lexer.contents[this.execHead];
        console.log("executing", this.execHead, currentStatement);
        let result = currentStatement.execute(this);
        if (!result) {
            console.log("In app.step error while running");
            return 1;
        }
    }
}
export { App };
// let app: App = new App()
// let program: string = "asdfafdsgdfgadsfg asdfag asdfg asdfg\nkasdfjasdf\njsadfa fjasdf\n";
// let inputs: number[] = [2, 4, 3];
// app.run(program, inputs);
//# sourceMappingURL=main.js.map