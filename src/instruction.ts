import {Argument, 
    CellArgument, 
    ReferenceArgument, 
    LabelArg, 
    NullArgument, 
    PopulatedArgument
} from "./argument.js";

import Token from "./token.js";
import Emulator from "./emulator.js";
import {
    EmptyArgumentError, 
    Error_, 
    InvalidArgumentError, 
    LabelNotFoundError, 
    UndefinedAccumulatorError, 
    UndefinedCellError, 
    UndefinedInputError, 
    ZeroDivisionError
} from "./errors.js";

abstract class Instruction extends Token{
    execute(argument: Argument, emulator: Emulator): [boolean, Error_[]] {

        const [status, errors] = this.validate(argument, emulator);

        if (!status) {
            return [status, errors];
        }

        this._execute(argument, emulator);

        return [true, []];
    };

    abstract _execute(argument: Argument, emulator: Emulator): void;

    validate(argument: Argument, emulator: Emulator): [boolean, Error_[]] {
        return [true, []];
    };

    protected abstract validateArgument(token: Token): boolean;

    protected static validateAccumulatorDefinition(accumulator: number | undefined): boolean{
        return (typeof accumulator !== 'undefined');
    }

    static Generate(text: string): Instruction{
        if (text.length == 0) {
            return new NullInstruction();
        }
        const instrClass = getKeyValue(Instructions)(text.toLowerCase());

        return new instrClass();
    }

    static validateInstruction(text: string) {
        if (text.length == 0) {
            return true
        }
        return (Instructions.hasOwnProperty(text.toLowerCase()));
    }

    parseValidate(lineIndex: number, argument: Argument): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;

        if (!this.validateArgument(argument)) {
            if (argument instanceof NullArgument) {
                errors.push(new EmptyArgumentError(lineIndex, this))
            }
            else if (argument instanceof PopulatedArgument) {
                errors.push(new InvalidArgumentError(lineIndex, argument, this))
            }
            status = false
        }

        return [status, errors]
    }
}

abstract class JumpInstr extends Instruction {

    protected validateArgument(argument: Argument): boolean{
      return (argument instanceof LabelArg);
      
    }

    protected static validateLabelsExistance(labelId: string, labelsWithIndices: {[key: string]: number}): boolean{
        return (labelsWithIndices.hasOwnProperty(labelId));
    }
}

abstract class OperationInst extends Instruction {
    protected validateArgument(argument: Argument): boolean {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof CellArgument);
    }

    protected static validateCellDefinition(argument: CellArgument, memory: number[]): boolean{
        
        return (typeof argument.getCellValue(memory) !== 'undefined');
    }

}

abstract class MathInst extends OperationInst {
    protected static validateMemoryDefinition(argument: CellArgument, memory: number[], execHead: number): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;

        if (!MathInst.validateAccumulatorDefinition(memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(execHead));
        }

        if (!MathInst.validateCellDefinition(argument, memory)) {
            status = false;
            errors.push(new UndefinedCellError(execHead));
        }

        return [status, errors];
    }
}

class Jump extends JumpInstr {
    _execute(argument: LabelArg, emulator: Emulator): void {
        emulator.execHead = argument.getLabelIndex(emulator.labelsWithIndices)
    }

    validate(argument: LabelArg, emulator: Emulator): [boolean, Error_[]] {
        let errors: Error_[] = [];
        let status = true;
        const labelId = argument.value;
        if (!Jump.validateLabelsExistance(labelId, emulator.labelsWithIndices)) {
            errors.push(new LabelNotFoundError(emulator.execHead, labelId));
            status = false;
        }
        return [status, errors]
    }

}

class Jgtz extends JumpInstr {
    _execute(argument: LabelArg, emulator: Emulator): void {
        
        if (emulator.memory[0] > 0) {
            const labelsWithIndices = emulator.labelsWithIndices;
            const value = argument.value;
            const newExecHead = labelsWithIndices[value];
            emulator.execHead = newExecHead;
        }
        else {
            emulator.execHead++;
        }
    }

    validate(argument: LabelArg, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;
        const labelId = argument.value;

        if (!Jgtz.validateLabelsExistance(labelId, emulator.labelsWithIndices)) {
            status = false;
            errors.push(new LabelNotFoundError(emulator.execHead, labelId));
        }

        if (!Jgtz.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead))
        }

        return [status, errors]
    }

}

class Jzero extends JumpInstr {
    _execute(argument: LabelArg, emulator: Emulator): void {
        if (emulator.memory[0] === 0) {
            const labelsWithIndices = emulator.labelsWithIndices;
            const value = argument.value
            emulator.execHead = labelsWithIndices[value];
        }
        else {
            emulator.execHead++;
        }
    }

    validate(argument: LabelArg, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;
        const labelId = argument.value;

        if (!Jzero.validateLabelsExistance(labelId, emulator.labelsWithIndices)) {
            status = false;
            errors.push(new LabelNotFoundError(emulator.execHead, labelId));
        }

        if (!Jzero.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead))
        }

        return [status, errors]
    }
}

class Read extends OperationInst {
    _execute(argument: ReferenceArgument, emulator: Emulator): void {
        let address = argument.getAddress(emulator.memory);
        emulator.memory[address] = emulator.inputs[emulator.inputHead];
        emulator.inputHead++;
        emulator.execHead++;
    }

    protected validateArgument(argument: Argument): boolean {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof ReferenceArgument);
    }

    validate(argument: ReferenceArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;

        if (!Read.validateInputDefinition(argument, emulator.inputs, emulator.inputHead)) {
            status = false; 
            errors.push(new UndefinedInputError(emulator.execHead))
        }

        return [status, errors]
    }

    private static validateInputDefinition(argument: ReferenceArgument, inputs: number[], inputHead: number): boolean {
        return (typeof inputs[inputHead] !== 'undefined');

    }
}

class Write extends OperationInst {
    _execute(argument: CellArgument, emulator: Emulator): void {
        emulator.outputs[emulator.outputHead] = argument.getCellValue(emulator.memory);
        emulator.outputHead++;
        emulator.execHead++;
    }

    validate(argument: CellArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;

        if (!OperationInst.validateCellDefinition(argument, emulator.memory)) {
            status = false;
            errors.push(new UndefinedCellError(emulator.execHead));
        }
        
        return [status, errors];
    }
}

class Load extends OperationInst {
    _execute(argument: CellArgument, emulator: Emulator): void {
        emulator.memory[0] = argument.getCellValue(emulator.memory);;
        emulator.execHead++;
    }

    validate(argument: CellArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;

        if (!OperationInst.validateCellDefinition(argument, emulator.memory)) {
            status = false;
            errors.push(new UndefinedCellError(emulator.execHead));
        }

        return [status, errors];
    }
}

class Store extends OperationInst {

    _execute(argument: ReferenceArgument, emulator: Emulator): void {
        emulator.memory[argument.getAddress(emulator.memory)] = emulator.memory[0];
        emulator.execHead++;
    }

    protected validateArgument(argument: Argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof ReferenceArgument);
    }

    validate(argument: ReferenceArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;
        if (!Store.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead))
        }
        return [status, errors];
    }
}

class Add extends MathInst {
    _execute(argument: CellArgument, emulator: Emulator): void {
        emulator.memory[0] += argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }

    validate(argument: CellArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;

        if (!Add.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead));
        }

        if (!Add.validateCellDefinition(argument, emulator.memory)) {
            status = false;
            errors.push(new UndefinedCellError(emulator.execHead));
        }

        return [status, errors];
    }
}

class Sub extends MathInst {
    _execute(argument: CellArgument, emulator: Emulator): void {
        emulator.memory[0] -= argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }

    validate(argument: CellArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;
        
        let [memoryIsValid, memoryErrors] = Sub.validateMemoryDefinition(argument, emulator.memory, emulator.execHead);
        errors.push(...memoryErrors)

        status = memoryIsValid ? status : memoryIsValid;


        return [status, errors];
    }

}

class Mult extends MathInst {
    _execute(argument: CellArgument, emulator: Emulator): void {
        emulator.memory[0] *= argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }

    validate(argument: CellArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;
        
        let [memoryIsValid, memoryErrors] = Mult.validateMemoryDefinition(argument, emulator.memory, emulator.execHead);
        errors.push(...memoryErrors)

        status = memoryIsValid ? status : memoryIsValid;

        return [status, errors];
    }
}

class Div extends MathInst {

    private static validateDivisor(argument: CellArgument, memory: number[]) {
        return (argument.getCellValue(memory) === 0);
    }

    _execute(argument: CellArgument, emulator: Emulator): void {
        emulator.memory[0] /= argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }

    validate(argument: CellArgument, emulator: Emulator): [boolean, Error_[]] {
        const errors: Error_[] = [];
        let status = true;
        
        const [memoryIsValid, memoryErrors] = MathInst.validateMemoryDefinition(argument, emulator.memory, emulator.execHead);
        if (!Div.validateDivisor(argument, emulator.memory)) {
            errors.push(new ZeroDivisionError(emulator.execHead));
            status = false
        }

        errors.push(...memoryErrors)

        status = memoryIsValid ? status : memoryIsValid;

        return [status, errors];
    }
}

class Halt extends Instruction {
    _execute(argument: NullArgument, emulator: Emulator): void {
        emulator.execHead = emulator.statements.length;
    }

    protected validateArgument(argument: Argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof NullArgument)
    }
}

export class NullInstruction extends Instruction {
    _execute(argument: Argument, emulator: Emulator): void {}

    protected validateArgument(argument: Argument): boolean {
        return (argument instanceof NullArgument)
    } 
}

const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];

const Instructions: {[key: string]: {new(): Instruction}} = {
    "read": Read,
    "load": Load,
    "store": Store,
    "add": Add,
    "sub": Sub,
    "mult": Mult,
    "div": Div,
    "jump": Jump,
    "jgtz": Jgtz,
    "jzero": Jzero,
    "write": Write,
    "halt": Halt,
};

export {Instruction, Instructions};