import { Error_ } from "./errors.js";
import { Label, PopulatedLabel } from "./label.js";
import Parser from "./parser.js";
import Statement  from "./statement.js";
import StatementArray from "./statementArray.js";

class Emulator {
    memory: number[];
    inputs: number[];
    outputs: number[];
    inputHead: number;
    outputHead: number;
    
    readonly labelsWithIndices: {[key: string]: number} = {};
    private _statements: StatementArray;

    public get statements() {
        return this._statements;
    }

    execHead: number;
    debugConsole: string[];
    errors: Error_[];
    breakpoints: number[];
    
    intervalId: ReturnType<typeof setInterval>;

    init(contents: string, inputs: number[], breakpoints: number[] = []): boolean {
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
            this.debugConsole = this.errors.map((e: Error_) => e.generateMessage())
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

    debug(program: string, inputs: number[], breakpoints: number[]) {
        if (!this.init(program, inputs, breakpoints)) {
            return 1;
        }
    }

    step() {
        if (this.execHead >= this.statements.length) {
            
            return 0;
        }
        let currentStatement: Statement = this.statements.getByIndex(this.execHead);

        // move core execution instruction code to this class and place it in methods
        // TODO: refactor emulator class

        const [status, errors]: [boolean, Error_[]] = currentStatement.execute(this);
        if (!status) {
            this.errors.push(...errors)
            this.debugConsole = this.errors.map((e: Error_) => e.generateMessage())
            return 1;
        }
    }
    private generateLabelsMap() {
        // swap statements' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.statements).forEach((key: string) => {
            if (typeof key !== 'undefined') {
                let index: number = parseInt(key);
                let statement = this.statements.getByIndex(index);
                let label = statement.label;

                if (label instanceof PopulatedLabel) {
                    let labelId = label.id;
                    this.labelsWithIndices[labelId] = index;
                }
            }
        })
    }    
}

export default Emulator;