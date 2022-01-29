import { Error_ } from "./exceptions.js";
import { Label, PopulatedLabel } from "./label.js";
import {Parser} from "./parser.js";
import { Statement } from "./statement.js";
class Emulator {
    memory: number[];
    inputs: number[];
    outputs: number[];
    statements: Statement[];
    labelsWithIndices: {[key: string]: number} = {};
    debugConsole: string[];
    errors: Error_[];
    parser: Parser;
    breakpoints: number[];
    execHead: number;
    inputHead: number;
    outputHead: number;
    intervalId: ReturnType<typeof setInterval>;
    programLength: number;

    init(program: string, inputs: number[], breakpoints: number[] = []): boolean {
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.errors = [];
        this.breakpoints = breakpoints;
        let parsedOK: boolean;
        let parserErrors: Error_[];
        [parsedOK, parserErrors, this.statements] = Parser.parse(program);
        // check if all tokens could be generated properly
        // let foundInvalidStatements = this.parser.contents.some((statement: Statement) => !statement.isValid);
        if (!parsedOK) {
            this.errors.push(...parserErrors);
            this.debugConsole = this.errors.map((e: Error_) => e.generateMessage())
            return false;
        }

        this.programLength = this.statements.length;
        this.generateLabelsMap();
        this.execHead = 0;
        this.inputHead = 0;
        this.outputHead = 0;
        return true;

    }

    validateLabelUniqueness(label: Label) {
        let labels: Array<string|undefined> = [];
        // TODO: fix autocomplete in the middle of other text
        this.statements.forEach(statement => {
            const labelId = statement?.label?.id;
            if (label instanceof PopulatedLabel) {
                labels.push(labelId);
            }
            
        });
        return !(labels.includes(label.id));
    }

    generateLabelsMap() {
        // swap statements' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.statements).forEach((key: string) => {
            if (typeof key !== 'undefined') {
                let index: number = parseInt(key);
                let statement = this.statements[index]
                let label = statement.label;

                if (label instanceof PopulatedLabel) {
                    let labelId = label.id;
                    this.labelsWithIndices[labelId] = index;
                }
            }
        })
    }

    run() {
        this.intervalId = setInterval(this.step, 500);

    }

    debug(program: string, inputs: number[], breakpoints: number[]) {
        if (!this.init(program, inputs, breakpoints)) {
            return 1;
        }
    }

    step() {
        if (this.execHead >= this.programLength) {
            
            return 0;
        }
        let currentStatement: Statement = this.statements[this.execHead];

        // move core execution instruction code to this class and place it in methods
        // TODO: refactor emulator class

        const [status, errors]: [boolean, Error_[]] = currentStatement.execute(this);
        if (!status) {
            this.errors.push(...errors)
            this.debugConsole = this.errors.map((e: Error_) => e.generateMessage())
            return 1;
        }
    }
}

export {Emulator};