import { PopulatedLabel } from "./label.js";
import { Parser } from "./parser.js";
class Emulator {
    constructor() {
        this.labelsWithIndices = {};
    }
    init(program, inputs, breakpoints = []) {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.errors = [];
        this.breakpoints = breakpoints;
        let parsedOK;
        let parserErrors;
        [parsedOK, parserErrors, this.statements] = Parser.parse(program);
        // check if all tokens could be generated properly
        // let foundInvalidStatements = this.parser.contents.some((statement: Statement) => !statement.isValid);
        if (!parsedOK) {
            this.errors.push(...parserErrors);
            this.debugConsole = this.errors.map((e) => e.generateMessage());
            return false;
        }
        this.programLength = this.statements.length;
        this.generateLabelsMap();
        this.execHead = 0;
        this.inputHead = 0;
        this.outputHead = 0;
        return true;
    }
    validateLabelUniqueness(label) {
        let labels = [];
        // TODO: fix autocomplete in the middle of other text
        this.statements.forEach(statement => {
            var _a;
            const labelId = (_a = statement === null || statement === void 0 ? void 0 : statement.label) === null || _a === void 0 ? void 0 : _a.id;
            if (label instanceof PopulatedLabel) {
                labels.push(labelId);
            }
        });
        return !(labels.includes(label.id));
    }
    generateLabelsMap() {
        // swap statements' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.statements).forEach((key) => {
            if (typeof key !== 'undefined') {
                let index = parseInt(key);
                let statement = this.statements[index];
                let label = statement.label;
                if (label instanceof PopulatedLabel) {
                    let labelId = label.id;
                    this.labelsWithIndices[labelId] = index;
                }
            }
        });
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
        if (this.execHead >= this.programLength) {
            return 0;
        }
        let currentStatement = this.statements[this.execHead];
        // TODO: restructure emulator validation and maybe refactor it's class 
        const [status, errors] = currentStatement.execute(this);
        if (!status) {
            this.errors.push(...errors);
            this.debugConsole = this.errors.map((e) => e.generateMessage());
            return 1;
        }
    }
}
export { Emulator };
//# sourceMappingURL=emulator.js.map