import { PopulatedLabel } from "./label.js";
import Parser from "./parser.js";
class Emulator {
    constructor() {
        this.labelsWithIndices = {};
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
        if (!parsedOK) {
            this.errors.push(...parserErrors);
            this.debugConsole = this.errors.map((e) => e.generateMessage());
            return false;
        }
        this._statements = statements;
        this.generateLabelsMap;
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
    generateLabelsMap() {
        // swap statements' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.statements).forEach((key) => {
            if (typeof key !== 'undefined') {
                let index = parseInt(key);
                let statement = this.statements.getByIndex(index);
                let label = statement.label;
                if (label instanceof PopulatedLabel) {
                    let labelId = label.id;
                    this.labelsWithIndices[labelId] = index;
                }
            }
        });
    }
}
export default Emulator;
//# sourceMappingURL=emulator.js.map