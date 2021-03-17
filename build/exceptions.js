class DuplicateLabelsError {
    static generateMessage(lineIndex, label) {
        return `DuplicateLabelsError: in line ${lineIndex} label '${label.id}' already exists\n`;
    }
}
class UnexpectedTokenError {
    static generateMessage(lineIndex, count) {
        return `UnexpectedTokenError: in line ${lineIndex} expected 3 tokens, got ${count}\n`;
    }
}
class InvalidInstructionError {
    static generateMessage(lineIndex, text) {
        return `InvalidInstructionError: in line ${lineIndex} '${text}'\n`;
    }
}
class InvalidArgumentError {
    static generateMessage(lineIndex, argument, instruction) {
        return `InvalidArgumentError: in line ${lineIndex} invalid argument of type ${argument.constructor.name} for ${instruction.constructor.name}\n`;
    }
}
class InvalidArgumentValueError {
    static generateMessage(lineIndex, argument) {
        return `InvalidArgumentValueError: in line ${lineIndex} unexpected value '${argument.value}' for argument of type ${argument.constructor.name}\n`;
    }
}
class EmptyArgumentError {
    static generateMessage(lineIndex, instruction) {
        return `EmptyArgumentError: in line ${lineIndex} instruction ${instruction.constructor.name} expects an argument\n`;
    }
}
class UndefinedAccumulatorError {
    static generateMessage(lineIndex) {
        return `UndefinedAccumulatorError: in line ${lineIndex}\n`;
    }
}
class UndefinedCellError {
    static generateMessage(lineIndex) {
        return `UndefinedCellError: in line ${lineIndex + 1}\n`;
    }
}
class UndefinedInputError {
    static generateMessage(lineIndex) {
        return `UndefinedInputError: in line ${lineIndex}\n`;
    }
}
class LabelNotFoundError {
    static generateMessage(lineIndex, labelId) {
        return `LabelNotFoundError: in line ${lineIndex} label ${labelId} doesn't exist\n`;
    }
}
class ZeroDivisionError {
    static generateMessage(lineIndex) {
        return `ZeroDivisionError: in line ${lineIndex}\n`;
    }
}
export { DuplicateLabelsError, UnexpectedTokenError, InvalidInstructionError, UndefinedAccumulatorError, UndefinedCellError, UndefinedInputError, InvalidArgumentError, InvalidArgumentValueError, EmptyArgumentError, LabelNotFoundError, ZeroDivisionError };
//# sourceMappingURL=exceptions.js.map