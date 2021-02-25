"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
var instruction_1 = require("./instruction");
var label_1 = require("./label");
var argument_1 = require("./argument");
var statement_1 = require("./statement");
var exceptions_1 = require("./exceptions");
var Lexer = /** @class */ (function () {
    function Lexer(contents) {
        var _this = this;
        this.debugConsole = [];
        // replace multiple whitespace characters with one space
        var lines;
        lines = contents.split("\n");
        // remove whitespaces around every line
        lines = lines.map(function (line) { return line.trim(); });
        // remove empty lines
        lines = lines.filter(function (n) { return n; });
        // convert lines to tokens
        this.contents = lines.map(function (line, index) {
            var elements = line.split(" ");
            var statementNow = _this.GenerateTokens(elements, index + 1);
            return statementNow;
        });
        this.programLength = this.contents.length;
        this.labelsWithIndices = {};
    }
    Lexer.prototype.GenerateTokens = function (elements, lineIndex) {
        var label;
        var instruction;
        var argument;
        // todo: add error when there are duplicated labels
        if (elements.length > 3) {
            var message = exceptions_1.UnexpectedTokenError.generateMessage(lineIndex, elements.length);
            this.debugConsole.push(message);
            return undefined;
        }
        else if (elements.length === 3) {
            label = new label_1.Label(elements[0]);
            instruction = instruction_1.Instruction.GenerateInstruction(elements[1]);
            argument = argument_1.Argument.GenerateArgument(elements[2]);
        }
        else if (elements.length === 2) {
            if (instruction_1.Instructions.hasOwnProperty(elements[0])) {
                label = new label_1.Label(undefined);
                instruction = instruction_1.Instruction.GenerateInstruction(elements[0]);
                argument = argument_1.Argument.GenerateArgument(elements[1]);
            }
            else if (instruction_1.Instructions.hasOwnProperty(elements[1])) {
                label = new label_1.Label(elements[0]);
                instruction = instruction_1.Instruction.GenerateInstruction(elements[1]);
            }
            else {
                var message = exceptions_1.InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        else {
            if (instruction_1.Instructions.hasOwnProperty(elements[0])) {
                label = new label_1.Label(undefined);
                instruction = instruction_1.Instruction.GenerateInstruction(elements[0]);
            }
            else {
                var message = exceptions_1.InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        if (!instruction.validateArgument(argument)) {
            var message = void 0;
            if (typeof argument === 'undefined') {
                message = exceptions_1.EmptyArgumentError.generateMessage(lineIndex, instruction);
            }
            else {
                message = exceptions_1.InvalidArgumentError.generateMessage(lineIndex, argument, instruction);
            }
            this.debugConsole.push(message);
            return undefined;
        }
        return new statement_1.Statement(label, instruction, argument);
    };
    Lexer.prototype.mapLabels = function () {
        var _this = this;
        // swap contents' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.contents).forEach(function (key) {
            if (typeof key !== 'undefined') {
                var index = parseInt(key);
                var labelId = _this.contents[key].label.id;
                // check if label if worth indexing
                if (typeof labelId !== "undefined") {
                    _this.labelsWithIndices[labelId] = index;
                }
            }
        });
    };
    return Lexer;
}());
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map