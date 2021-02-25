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
        return `UnexpectedTokenError: in line ${lineIndex} expected three tokens, got ${count}\n`;
    }
}

class InvalidInstructionError {
    static generateMessage(lineIndex: number, text: string){
        return `InvalidInstructionError: in line ${lineIndex} '${text}'\n`;
    }
}

class InvalidArgumentError {
    static generateMessage(lineIndex: number, argumentType: Argument, instruction: Instruction){
        return `InvalidArgumentError: in line ${lineIndex} invalid argument of type ${argumentType.constructor.name} for ${instruction.constructor.name}\n`;
    }
}

class EmptyArgumentError {
    static generateMessage(lineIndex: number, instruction: Instruction){
        return `EmptyArgumentError: in line ${lineIndex} instruction ${instruction.constructor.name} expects an argument`;
    }
}

class UndefinedAccumulatorError {
    static generateMessage(lineIndex: number) {
        return `UndefinedAccumulatorError: in line ${lineIndex}\n`;
    }
}

class UndefinedCellError {
    static generateMessage(lineIndex: number) {
        return `UndefinedCellerror: in line ${lineIndex}\n`;
    }
}



class LabelNotFoundError {
    static generateMessage(lineIndex: number, labelId: string) {
        return `LabelNotFoundError: in line ${lineIndex} label ${labelId} doesn't exist\n`;
    }
}




export {DuplicateLabelsError, 
    UnexpectedTokenError, 
    InvalidInstructionError, 
    UndefinedAccumulatorError, 
    UndefinedCellError, 
    InvalidArgumentError, 
    EmptyArgumentError,
    LabelNotFoundError
}
 