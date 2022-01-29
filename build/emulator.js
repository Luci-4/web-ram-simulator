import Parser from "./parser.js";
import StatementArray from "./statementArray.js";
class Emulator {
    constructor() {
        this.labelsWithIndices = {};
        this._statements = new StatementArray();
    }
    get statements() {
        return this._statements;
    }
    init(contents, inputs, breakpoints = []) {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.errors = [];
        this.breakpoints = breakpoints;
        // let parsedOK: boolean;
        // let parserErrors: Error_[];
        let [parsedOK, parserErrors, statements] = Parser.parse(contents);
        this._statements = statements;
        if (!parsedOK) {
            this.errors.push(...parserErrors);
            this.debugConsole = this.errors.map((e) => e.generateMessage());
            return false;
        }
        this.labelsWithIndices = this._statements.generateLabelsMap();
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
        if (this.execHead >= this.statements.length) {
            return 0;
        }
        let currentStatement = this.statements.getByIndex(this.execHead);
        // move core execution instruction code to this class and place it in methods
        // TODO: refactor emulator class
        const [status, errors] = currentStatement.execute(this);
        if (!status) {
            this.errors.push(...errors);
            this.debugConsole = this.errors.map((e) => e.generateMessage());
            return 1;
        }
    }
}
export default Emulator;
//# sourceMappingURL=emulator.js.map