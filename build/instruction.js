import { CellArgument, ReferenceArgument, LabelArg, NullArgument, PopulatedArgument } from "./argument.js";
import { Token } from "./token.js";
import { EmptyArgumentError, InvalidArgumentError, LabelNotFoundError, UndefinedAccumulatorError, UndefinedCellError, UndefinedInputError, ZeroDivisionError } from "./exceptions.js";
class Instruction extends Token {
    execute(argument, emulator) {
        const [status, errors] = this.validate(argument, emulator);
        if (!status) {
            return [status, errors];
        }
        this._execute(argument, emulator);
        return [true, []];
    }
    ;
    validate(argument, emulator) {
        return [true, []];
    }
    ;
    static validateAccumulatorDefinition(accumulator) {
        return (typeof accumulator !== 'undefined');
    }
    static Generate(text) {
        if (text.length == 0) {
            return new NullInstruction();
        }
        const instrClass = getKeyValue(Instructions)(text.toLowerCase());
        return new instrClass();
    }
    static validateInstruction(text) {
        if (text.length == 0) {
            return true;
        }
        return (Instructions.hasOwnProperty(text.toLowerCase()));
    }
    parseValidate(lineIndex, argument) {
        const errors = [];
        let status = true;
        if (!this.validateArgument(argument)) {
            if (argument instanceof NullArgument) {
                errors.push(new EmptyArgumentError(lineIndex, this));
            }
            else if (argument instanceof PopulatedArgument) {
                errors.push(new InvalidArgumentError(lineIndex, argument, this));
            }
            status = false;
        }
        return [status, errors];
    }
}
class JumpInstr extends Instruction {
    validateArgument(argument) {
        return (argument instanceof LabelArg);
    }
    static validateLabelsExistance(labelId, labelsWithIndices) {
        return (labelsWithIndices.hasOwnProperty(labelId));
    }
}
class OperationInst extends Instruction {
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof CellArgument);
    }
    static validateCellDefinition(argument, memory) {
        return (typeof argument.getCellValue(memory) !== 'undefined');
    }
}
class MathInst extends OperationInst {
    static validateMemoryDefinition(argument, memory, execHead) {
        const errors = [];
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
    _execute(argument, emulator) {
        emulator.execHead = argument.getLabelIndex(emulator.labelsWithIndices);
    }
    validate(argument, emulator) {
        let errors = [];
        let status = true;
        const labelId = argument.value;
        if (!Jump.validateLabelsExistance(labelId, emulator.labelsWithIndices)) {
            errors.push(new LabelNotFoundError(emulator.execHead, labelId));
            status = false;
        }
        return [status, errors];
    }
}
class Jgtz extends JumpInstr {
    _execute(argument, emulator) {
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
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        const labelId = argument.value;
        if (!Jgtz.validateLabelsExistance(labelId, emulator.labelsWithIndices)) {
            status = false;
            errors.push(new LabelNotFoundError(emulator.execHead, labelId));
        }
        if (!Jgtz.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead));
        }
        return [status, errors];
    }
}
class Jzero extends JumpInstr {
    _execute(argument, emulator) {
        if (emulator.memory[0] === 0) {
            const labelsWithIndices = emulator.labelsWithIndices;
            const value = argument.value;
            emulator.execHead = labelsWithIndices[value];
        }
        else {
            emulator.execHead++;
        }
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        const labelId = argument.value;
        if (!Jzero.validateLabelsExistance(labelId, emulator.labelsWithIndices)) {
            status = false;
            errors.push(new LabelNotFoundError(emulator.execHead, labelId));
        }
        if (!Jzero.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead));
        }
        return [status, errors];
    }
}
class Read extends OperationInst {
    _execute(argument, emulator) {
        let address = argument.getAddress(emulator.memory);
        emulator.memory[address] = emulator.inputs[emulator.inputHead];
        emulator.inputHead++;
        emulator.execHead++;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof ReferenceArgument);
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        if (!Read.validateInputDefinition(argument, emulator.inputs, emulator.inputHead)) {
            status = false;
            errors.push(new UndefinedInputError(emulator.execHead));
        }
        return [status, errors];
    }
    static validateInputDefinition(argument, inputs, inputHead) {
        return (typeof inputs[inputHead] !== 'undefined');
    }
}
class Write extends OperationInst {
    _execute(argument, emulator) {
        emulator.outputs[emulator.outputHead] = argument.getCellValue(emulator.memory);
        emulator.outputHead++;
        emulator.execHead++;
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        if (!OperationInst.validateCellDefinition(argument, emulator.memory)) {
            status = false;
            errors.push(new UndefinedCellError(emulator.execHead));
        }
        return [status, errors];
    }
}
class Load extends OperationInst {
    _execute(argument, emulator) {
        emulator.memory[0] = argument.getCellValue(emulator.memory);
        ;
        emulator.execHead++;
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        if (!OperationInst.validateCellDefinition(argument, emulator.memory)) {
            status = false;
            errors.push(new UndefinedCellError(emulator.execHead));
        }
        return [status, errors];
    }
}
class Store extends OperationInst {
    _execute(argument, emulator) {
        emulator.memory[argument.getAddress(emulator.memory)] = emulator.memory[0];
        emulator.execHead++;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof ReferenceArgument);
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        if (!Store.validateAccumulatorDefinition(emulator.memory[0])) {
            status = false;
            errors.push(new UndefinedAccumulatorError(emulator.execHead));
        }
        return [status, errors];
    }
}
class Add extends MathInst {
    _execute(argument, emulator) {
        emulator.memory[0] += argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }
    validate(argument, emulator) {
        const errors = [];
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
    _execute(argument, emulator) {
        emulator.memory[0] -= argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        let [memoryIsValid, memoryErrors] = Sub.validateMemoryDefinition(argument, emulator.memory, emulator.execHead);
        errors.push(...memoryErrors);
        status = memoryIsValid ? status : memoryIsValid;
        return [status, errors];
    }
}
class Mult extends MathInst {
    _execute(argument, emulator) {
        emulator.memory[0] *= argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        let [memoryIsValid, memoryErrors] = Mult.validateMemoryDefinition(argument, emulator.memory, emulator.execHead);
        errors.push(...memoryErrors);
        status = memoryIsValid ? status : memoryIsValid;
        return [status, errors];
    }
}
class Div extends MathInst {
    static validateDivisor(argument, memory) {
        return (argument.getCellValue(memory) === 0);
    }
    _execute(argument, emulator) {
        emulator.memory[0] /= argument.getCellValue(emulator.memory);
        emulator.execHead++;
    }
    validate(argument, emulator) {
        const errors = [];
        let status = true;
        const [memoryIsValid, memoryErrors] = MathInst.validateMemoryDefinition(argument, emulator.memory, emulator.execHead);
        if (!Div.validateDivisor(argument, emulator.memory)) {
            errors.push(new ZeroDivisionError(emulator.execHead));
            status = false;
        }
        errors.push(...memoryErrors);
        status = memoryIsValid ? status : memoryIsValid;
        return [status, errors];
    }
}
class Halt extends Instruction {
    _execute(argument, emulator) {
        emulator.execHead = emulator.programLength;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof NullArgument);
    }
}
export class NullInstruction extends Instruction {
    _execute(argument, emulator) { }
    validateArgument(argument) {
        return (argument instanceof NullArgument);
    }
}
const getKeyValue = (obj) => (key) => obj[key];
const Instructions = {
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
export { Instruction, Instructions };
//# sourceMappingURL=instruction.js.map