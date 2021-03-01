"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const instruction_1 = require("./instruction");
const label_1 = require("./label");
const argument_1 = require("./argument");
const statement_1 = require("./statement");
const exceptions_1 = require("./exceptions");
class Lexer {
    constructor(contents) {
        this.debugConsole = [];
        // replace multiple whitespace characters with one space
        let lines;
        lines = contents.split("\n");
        // remove whitespaces around every line
        lines = lines.map((line) => line.trim());
        // remove empty lines
        lines = lines.filter((n) => n);
        // convert lines to tokens
        this.contents = lines.map((line, index) => {
            let elements = line.split(" ");
            let statementNow = this.GenerateTokens(elements, index + 1);
            return statementNow;
        });
        this.programLength = this.contents.length;
        this.labelsWithIndices = {};
    }
    GenerateTokens(elements, lineIndex) {
        let label;
        let instruction;
        let argument;
        // todo: add error when there are duplicated labels
        if (elements.length > 3) {
            let message = exceptions_1.UnexpectedTokenError.generateMessage(lineIndex, elements.length);
            this.debugConsole.push(message);
            return undefined;
        }
        else if (elements.length === 3) {
            label = new label_1.Label(elements[0]);
            if (!instruction_1.Instruction.validateInstruction(elements[1])) {
                let message = exceptions_1.InvalidInstructionError.generateMessage(lineIndex, elements[1]);
                this.debugConsole.push(message);
                return undefined;
            }
            instruction = instruction_1.Instruction.GenerateInstruction(elements[1]);
            argument = argument_1.Argument.GenerateArgument(elements[2]);
        }
        else if (elements.length === 2) {
            if (instruction_1.Instructions.hasOwnProperty(elements[0])) {
                label = new label_1.Label(undefined);
                if (!instruction_1.Instruction.validateInstruction(elements[0])) {
                    let message = exceptions_1.InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                    this.debugConsole.push(message);
                    return undefined;
                }
                instruction = instruction_1.Instruction.GenerateInstruction(elements[0]);
                argument = argument_1.Argument.GenerateArgument(elements[1]);
            }
            else if (instruction_1.Instruction.validateInstruction(elements[1])) {
                label = new label_1.Label(elements[0]);
                instruction = instruction_1.Instruction.GenerateInstruction(elements[1]);
            }
            else {
                let message = exceptions_1.InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        else {
            if (instruction_1.Instruction.validateInstruction(elements[0])) {
                label = new label_1.Label(undefined);
                instruction = instruction_1.Instruction.GenerateInstruction(elements[0]);
            }
            else {
                let message = exceptions_1.InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        if (!instruction.validateArgument(argument)) {
            let message;
            if (typeof argument === 'undefined') {
                message = exceptions_1.EmptyArgumentError.generateMessage(lineIndex, instruction);
            }
            else {
                message = exceptions_1.InvalidArgumentError.generateMessage(lineIndex, argument, instruction);
            }
            this.debugConsole.push(message);
            return undefined;
        }
        if (!argument.validateValue()) {
            let message = exceptions_1.InvalidArgumentValueError.generateMessage(lineIndex, argument);
            this.debugConsole.push(message);
            return undefined;
        }
        return new statement_1.Statement(label, instruction, argument);
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
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map