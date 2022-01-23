import { Instruction } from "./instruction.js";
import { Label } from "./label.js";
import { Argument } from "./argument.js";
import { Statement } from "./statement.js";
import { UnexpectedTokenError, UnidentifiedInstructionError } from "./exceptions.js";
export class Parser {
    constructor(contents) {
        this.errors = [];
        this.contents = [];
        // replace multiple whitespace characters with one space
        let lines;
        lines = contents.split("\n");
        // remove whitespaces around every line
        lines = lines.map((line) => line.trim());
        // convert lines to tokens
        lines.forEach((line, index) => {
            let elements = line.split(" ");
            let statementNow = this.GenerateTokens(elements, index + 1);
            this.contents.push(statementNow);
        });
        this.programLength = this.contents.length;
        this.labelsWithIndices = {};
    }
    IdentifyInstruction(elements) {
        for (let elemInd = 0; elemInd < elements.length; elemInd++) {
            if (Instruction.validateInstruction(elements[elemInd])) {
                return elemInd;
            }
        }
        return -1;
    }
    GenerateTokens(elements, lineIndex) {
        const statement = new Statement(lineIndex);
        if (elements.length > 3) {
            this.errors.push(new UnexpectedTokenError(lineIndex, elements.length));
            return statement;
        }
        const instrInd = this.IdentifyInstruction(elements);
        if (instrInd < 0) {
            this.errors.push(new UnidentifiedInstructionError(lineIndex));
            return statement;
        }
        const labelInd = instrInd - 1;
        const argumentInd = instrInd + 1;
        statement.populate(Label.Generate(elements[labelInd]), Instruction.Generate(elements[instrInd]), Argument.Generate(elements[argumentInd]));
        const [status, errors] = statement.validate(this);
        if (!status) {
            this.errors.push(...errors);
        }
        return statement;
    }
    generateLabelsMap() {
        // swap contents' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.contents).forEach((key) => {
            if (typeof key !== 'undefined') {
                let index = parseInt(key);
                let statement = this.contents[index];
                let labelId = statement.label.id;
                if (typeof labelId !== "undefined") {
                    this.labelsWithIndices[labelId] = index;
                }
            }
        });
    }
    validateLabelUniqueness(label) {
        let labels = [];
        // TODO: fix autocomplete in the middle of other text
        this.contents.forEach(statement => {
            var _a;
            if (typeof ((_a = statement === null || statement === void 0 ? void 0 : statement.label) === null || _a === void 0 ? void 0 : _a.id) !== "undefined") {
                labels.push(statement.label.id);
            }
        });
        if (labels.includes(label.id)) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=parser.js.map