import {Argument} from "./argument";
import {Instruction} from "./instruction";
import {Label} from "./label";

class DuplicateLabelsError {
    static generateMessage(lineIndex: number, label: Label){
        return `DuplicateLabelsError:in line ${lineIndex} label ${label.id} already exists\n`;
    }
}

class UnexpectedTokenError {
    static generateMessage(lineIndex: number, count: number){
        return `UnexpectedTokenError: in line ${lineIndex} expected 3 tokens, got ${count}\n`;
    }
}

class InvalidInstructionError {
    static generateMessage(lineIndex: number, text: string){
        return `InvalidInstructionError: in line ${lineIndex} '${text}'\n`;
    }
}

class InvalidArgumentError {
    static generateMessage(lineIndex: number, argument: Argument, instruction: Instruction){
        return `InvalidArgumentError: in line ${lineIndex} invalid argument of type ${argument.constructor.name} for ${instruction.constructor.name}\n`;
    }
}

class InvalidArgumentValueError {
    static generateMessage(lineIndex: number, argument: Argument){
        return `InvalidArgumentValueError: in line ${lineIndex} unexpected value '${argument.value}' for argument of type ${argument.constructor.name}\n`
    }
}

class EmptyArgumentError {
    static generateMessage(lineIndex: number, instruction: Instruction){
        return `EmptyArgumentError: in line ${lineIndex} instruction ${instruction.constructor.name} expects an argument\n`;
    }
}

class UndefinedAccumulatorError {
    static generateMessage(lineIndex: number) {
        return `UndefinedAccumulatorError: in line ${lineIndex}\n`;
    }
}

class UndefinedCellError {
    static generateMessage(lineIndex: number) {
        return `UndefinedCellError: in line ${lineIndex+1}\n`;
    }
}

class UndefinedInputError {
    static generateMessage(lineIndex: number){
        return `UndefinedInputError: in line ${lineIndex}\n`;
    }
}



class LabelNotFoundError {
    static generateMessage(lineIndex: number, labelId: string) {
        return `LabelNotFoundError: in line ${lineIndex} label ${labelId} doesn't exist\n`;
    }
}

class ZeroDivisionError {
    static generateMessage(lineIndex: number){
        return `ZeroDivisionError: in line ${lineIndex}\n`;
    }
}




export {DuplicateLabelsError, 
    UnexpectedTokenError, 
    InvalidInstructionError, 
    UndefinedAccumulatorError, 
    UndefinedCellError,
    UndefinedInputError,
    InvalidArgumentError, 
    InvalidArgumentValueError,
    EmptyArgumentError,
    LabelNotFoundError,
    ZeroDivisionError
}
 