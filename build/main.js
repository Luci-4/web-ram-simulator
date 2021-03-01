"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const lexer_1 = require("./lexer");
class App {
    init(program, inputs) {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.lexer = new lexer_1.Lexer(program);
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
    run(program, inputs) {
        // check if there were errors during init
        if (!this.init(program, inputs)) {
            return 1;
        }
        while (this.execHead < this.lexer.programLength) {
            let currentStatement = this.lexer.contents[this.execHead];
            if (!currentStatement.execute(this)) {
                return 1;
            }
        }
        return 0;
    }
}
exports.App = App;
//# sourceMappingURL=main.js.map