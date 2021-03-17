import { Instruction } from "./instruction.js";
import { Label } from "./label.js";
import { Argument } from "./argument.js";
import { Statement } from "./statement.js";
import { DuplicateLabelsError, UnexpectedTokenError, InvalidInstructionError, InvalidArgumentError, InvalidArgumentValueError, EmptyArgumentError } from "./exceptions.js";
export class Lexer {
    constructor(contents) {
        this.debugConsole = [];
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
    GenerateTokens(elements, lineIndex) {
        let label;
        let instruction;
        let argument;
        if (elements.length > 3) {
            let message = UnexpectedTokenError.generateMessage(lineIndex, elements.length);
            this.debugConsole.push(message);
            return undefined;
        }
        else if (elements.length === 3) {
            label = new Label(elements[0]);
            if (!Instruction.validateInstruction(elements[1])) {
                let message = InvalidInstructionError.generateMessage(lineIndex, elements[1]);
                this.debugConsole.push(message);
                return undefined;
            }
            instruction = Instruction.GenerateInstruction(elements[1]);
            argument = Argument.GenerateArgument(elements[2]);
        }
        else if (elements.length === 2) {
            // empty, instruction, argument
            if (Instruction.validateInstruction(elements[0])) {
                label = new Label(undefined);
                instruction = Instruction.GenerateInstruction(elements[0]);
                argument = Argument.GenerateArgument(elements[1]);
            }
            // label, instruction, empty
            else if (Instruction.validateInstruction(elements[1])) {
                label = new Label(elements[0]);
                instruction = Instruction.GenerateInstruction(elements[1]);
            }
            else {
                let message = InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        else {
            if (Instruction.validateInstruction(elements[0])) {
                label = new Label(undefined);
                instruction = Instruction.GenerateInstruction(elements[0]);
            }
            // empty Statement for empty lines;
            else if (elements[0].length === 0) {
                label = new Label(undefined);
                instruction = undefined;
                argument = undefined;
            }
            else {
                let message = InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        if (typeof instruction !== "undefined" && !instruction.validateArgument(argument)) {
            let message;
            if (typeof argument === 'undefined') {
                message = EmptyArgumentError.generateMessage(lineIndex, instruction);
            }
            else {
                message = InvalidArgumentError.generateMessage(lineIndex, argument, instruction);
            }
            this.debugConsole.push(message);
            return undefined;
        }
        if (typeof argument !== "undefined" && !argument.validateValue()) {
            let message = InvalidArgumentValueError.generateMessage(lineIndex, argument);
            this.debugConsole.push(message);
            return undefined;
        }
        if (!this.validateLabelUniqueness(label)) {
            let message = DuplicateLabelsError.generateMessage(lineIndex, label);
            this.debugConsole.push(message);
            return undefined;
        }
        return new Statement(label, instruction, argument);
    }
    mapLabels() {
        // swap contents' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.contents).forEach(key => {
            if (typeof key !== 'undefined') {
                let index = parseInt(key);
                let labelId = this.contents[key].label.id;
                // check if label if worth indexing
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
            if (typeof statement !== "undefined" && typeof statement.label.id !== "undefined") {
                labels.push(statement.label.id);
            }
        });
        if (labels.includes(label.id)) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=lexer.js.map