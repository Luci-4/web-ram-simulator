"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelNotFoundError = exports.EmptyArgumentError = exports.InvalidArgumentValueError = exports.InvalidArgumentError = exports.UndefinedCellError = exports.UndefinedAccumulatorError = exports.InvalidInstructionError = exports.UnexpectedTokenError = exports.DuplicateLabelsError = void 0;
class DuplicateLabelsError {
    static generateMessage(lineIndex, label) {
        return `DuplicateLabelsError:in line ${lineIndex} label ${label.id} already exists\n`;
    }
}
exports.DuplicateLabelsError = DuplicateLabelsError;
class UnexpectedTokenError {
    static generateMessage(lineIndex, count) {
        return `UnexpectedTokenError: in line ${lineIndex} expected 3 tokens, got ${count}\n`;
    }
}
exports.UnexpectedTokenError = UnexpectedTokenError;
class InvalidInstructionError {
    static generateMessage(lineIndex, text) {
        return `InvalidInstructionError: in line ${lineIndex} '${text}'\n`;
    }
}
exports.InvalidInstructionError = InvalidInstructionError;
class InvalidArgumentError {
    static generateMessage(lineIndex, argument, instruction) {
        return `InvalidArgumentError: in line ${lineIndex} invalid argument of type ${argument.constructor.name} for ${instruction.constructor.name}\n`;
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
class InvalidArgumentValueError {
    static generateMessage(lineIndex, argument) {
        return `InvalidArgumentValueError: in line ${lineIndex} unexpected value '${argument.value}' for argument of type ${argument.constructor.name}\n`;
    }
}
exports.InvalidArgumentValueError = InvalidArgumentValueError;
class EmptyArgumentError {
    static generateMessage(lineIndex, instruction) {
        return `EmptyArgumentError: in line ${lineIndex} instruction ${instruction.constructor.name} expects an argument\n`;
    }
}
exports.EmptyArgumentError = EmptyArgumentError;
class UndefinedAccumulatorError {
    static generateMessage(lineIndex) {
        return `UndefinedAccumulatorError: in line ${lineIndex}\n`;
    }
}
exports.UndefinedAccumulatorError = UndefinedAccumulatorError;
class UndefinedCellError {
    static generateMessage(lineIndex) {
        return `UndefinedCellError: in line ${lineIndex}\n`;
    }
}
exports.UndefinedCellError = UndefinedCellError;
class LabelNotFoundError {
    static generateMessage(lineIndex, labelId) {
        return `LabelNotFoundError: in line ${lineIndex} label ${labelId} doesn't exist\n`;
    }
}
exports.LabelNotFoundError = LabelNotFoundError;
//# sourceMappingURL=exceptions.js.map