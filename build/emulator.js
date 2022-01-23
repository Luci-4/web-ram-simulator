import { Parser } from "./parser.js";
class Emulator {
    init(program, inputs, breakpoints = []) {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.errors = [];
        this.parser = new Parser(program);
        this.breakpoints = breakpoints;
        // check if all tokens could be generated properly
        let foundInvalidStatements = this.parser.contents.some((statement) => !statement.isValid);
        if (foundInvalidStatements) {
            // load all messagesparser's console
            this.errors.push(...this.parser.errors);
            this.debugConsole = this.errors.map((e) => e.generateMessage());
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
    debug(program, inputs, breakpoints) {
        if (!this.init(program, inputs, breakpoints)) {
            return 1;
        }
    }
    step() {
        if (this.execHead >= this.parser.programLength) {
            return 0;
        }
        let currentStatement = this.parser.contents[this.execHead];
        let result = currentStatement === null || currentStatement === void 0 ? void 0 : currentStatement.execute(this);
        if (!result) {
            return 1;
        }
    }
}
export { Emulator };
//# sourceMappingURL=emulator.js.map