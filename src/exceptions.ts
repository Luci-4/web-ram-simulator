import {Argument, PopulatedArgument} from "./argument";
import {Instruction} from "./instruction";
import {Label, PopulatedLabel} from "./label";

abstract class Error_ {
    lineNumber: number;

    constructor(lineIndex: number) {
        this.lineNumber = lineIndex+1;
    }

    abstract generateMessage(): string;
}

class DuplicateLabelsError extends Error_ {
    label: Label;

    constructor(lineIndex: number, label: Label) {
        super(lineIndex);
        this.label = label;
    }

    generateMessage() {
        return `DuplicateLabelsError: in line ${this.lineNumber} label '${this.label.id}' already exists\n`;
    }
}

class UnexpectedTokenError extends Error_ {
    count: number;

    constructor(lineIndex: number, count: number) {
        super(lineIndex);
        this.count = count;
    }

    generateMessage() {
        return `UnexpectedTokenError: in line ${this.lineNumber} expected max 3 tokens, got ${this.count}\n`;
    }
}

class UnidentifiedInstructionError extends Error_ {
    generateMessage() {
        return `UnidentifiedInstructionError: in line ${this.lineNumber} could not identify any instruction\n`;
    }
}

class InvalidArgumentError extends Error_ {
    argument: PopulatedArgument;
    instruction: Instruction

    constructor(lineIndex: number, argument: PopulatedArgument, instruction: Instruction) {
        super(lineIndex);
        this.argument = argument;
        this.instruction = instruction;
    }

    generateMessage() {
        return `InvalidArgumentError: in line ${this.lineNumber} invalid argument of type ${this.argument.constructor.name} for ${this.instruction.constructor.name}\n`;
    }
}

class InvalidArgumentValueError extends Error_ {
    argument: Argument;

    constructor(lineIndex: number, argument: Argument) {
        super(lineIndex);
        this.argument = argument;
    }

    generateMessage() {
        return `InvalidArgumentValueError: in line ${this.lineNumber} unexpected value '${this.argument.value}' for argument of type ${this.argument.constructor.name}\n`
    }
}

class EmptyArgumentError extends Error_ {
    instruction: Instruction;

    constructor(lineIndex: number, instruction: Instruction) {
        super(lineIndex);
        this.instruction = instruction;
    }

    generateMessage() {
        return `EmptyArgumentError: in line ${this.lineNumber} instruction ${this.instruction.constructor.name} expects an argument\n`;
    }
}

class UndefinedAccumulatorError extends Error_ {
    generateMessage() {
        return `UndefinedAccumulatorError: in line ${this.lineNumber}\n`;
    }
}

class UndefinedCellError extends Error_ {
    generateMessage() {
        return `UndefinedCellError: in line ${this.lineNumber}\n`;
    }
}

class UndefinedInputError extends Error_ {
    generateMessage() {
        return `UndefinedInputError: in line ${this.lineNumber}\n`;
    }
}

class LabelNotFoundError extends Error_ {
    labelId: string;

    constructor(lineIndex: number, labelId: string) {
        super(lineIndex);
        this.labelId = labelId;
    }

    generateMessage() {
        return `LabelNotFoundError: in line ${this.lineNumber} label ${this.labelId} doesn't exist\n`;
    }
}

class ZeroDivisionError extends Error_ {
    generateMessage() {
        return `ZeroDivisionError: in line ${this.lineNumber}\n`;
    }
}

export {
    Error_,
    DuplicateLabelsError, 
    UnexpectedTokenError, 
    UnidentifiedInstructionError,
    UndefinedAccumulatorError, 
    UndefinedCellError,
    UndefinedInputError,
    InvalidArgumentError, 
    InvalidArgumentValueError,
    EmptyArgumentError,
    LabelNotFoundError,
    ZeroDivisionError
}
 