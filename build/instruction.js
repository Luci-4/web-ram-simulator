import { CellArgument, ReferenceArgument, LabelArg, NullArgument, PopulatedArgument } from "./argument.js";
import { Token } from "./token.js";
import { EmptyArgumentError, InvalidArgumentError, LabelNotFoundError, UndefinedAccumulatorError, UndefinedCellError, UndefinedInputError, ZeroDivisionError } from "./exceptions.js";
class Instruction extends Token {
    validateAccumulatorDefinition(emulator) {
        if (typeof emulator.memory[0] === 'undefined') {
            emulator.errors.push(new UndefinedAccumulatorError(emulator.execHead));
            return false;
        }
        return true;
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
        console.log("parse validate", argument);
        if (!this.validateArgument(argument)) {
            console.log("argument invalid");
            if (argument instanceof NullArgument) {
                errors.push(new EmptyArgumentError(lineIndex, this));
            }
            else if (argument instanceof PopulatedArgument) {
                errors.push(new InvalidArgumentError(lineIndex, argument, this));
            }
            status = false;
        }
        console.log(this, "parse validate", status, errors);
        return [status, errors];
    }
}
class JumpInstr extends Instruction {
    validateArgument(argument) {
        return (argument instanceof LabelArg);
    }
    validateLabelsExistance(labelId, emulator) {
        const parser = emulator.parser;
        const labelsWithIndices = parser.labelsWithIndices;
        if (!labelsWithIndices.hasOwnProperty(labelId)) {
            emulator.errors.push(new LabelNotFoundError(emulator.execHead, labelId));
            return false;
        }
        return true;
    }
}
class OperationInst extends Instruction {
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof CellArgument);
    }
    validateCellDefinition(argument, emulator) {
        if (typeof argument.getCellValue(emulator) === 'undefined') {
            emulator.errors.push(new UndefinedCellError(emulator.execHead));
            return false;
        }
        return true;
    }
}
class Jump extends JumpInstr {
    execute(argument, emulator) {
        if (!this.validateLabelsExistance(argument.value, emulator)) {
            return false;
        }
        emulator.execHead = argument.getLabelIndex(emulator);
        return true;
    }
}
class Jgtz extends JumpInstr {
    execute(argument, emulator) {
        if (!this.validateLabelsExistance(argument.value, emulator)) {
            return false;
        }
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        if (emulator.memory[0] > 0) {
            const parser = emulator.parser;
            const labelsWithIndices = parser.labelsWithIndices;
            const value = argument.value;
            const newExecHead = labelsWithIndices[value];
            emulator.execHead = newExecHead;
        }
        else {
            emulator.execHead++;
        }
        return true;
    }
}
class Jzero extends JumpInstr {
    execute(argument, emulator) {
        if (!this.validateLabelsExistance(argument.value, emulator)) {
            return false;
        }
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        if (emulator.memory[0] === 0) {
            const parser = emulator.parser;
            const labelsWithIndices = parser.labelsWithIndices;
            const value = argument.value;
            emulator.execHead = labelsWithIndices[value];
        }
        else {
            emulator.execHead++;
        }
        return true;
    }
}
class Read extends OperationInst {
    execute(argument, emulator) {
        if (!this.validateInputDefinition(argument, emulator)) {
            return false;
        }
        let address = argument.getAddress(emulator);
        emulator.memory[address] = emulator.inputs[emulator.inputHead];
        emulator.inputHead++;
        emulator.execHead++;
        return true;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof ReferenceArgument);
    }
    validateInputDefinition(argument, emulator) {
        if (typeof emulator.inputs[emulator.inputHead] === 'undefined') {
            emulator.errors.push(new UndefinedInputError(emulator.execHead + 1));
            return false;
        }
        return true;
    }
}
class Write extends OperationInst {
    execute(argument, emulator) {
        if (!super.validateCellDefinition(argument, emulator)) {
            return false;
        }
        emulator.outputs[emulator.outputHead] = argument.getCellValue(emulator);
        emulator.outputHead++;
        emulator.execHead++;
        return true;
    }
}
class Load extends OperationInst {
    execute(argument, emulator) {
        if (!super.validateCellDefinition(argument, emulator)) {
            return false;
        }
        emulator.memory[0] = argument.getCellValue(emulator);
        ;
        emulator.execHead++;
        return true;
    }
}
class Store extends OperationInst {
    execute(argument, emulator) {
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        emulator.memory[argument.getAddress(emulator)] = emulator.memory[0];
        emulator.execHead++;
        return true;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof ReferenceArgument);
    }
}
class Add extends OperationInst {
    execute(argument, emulator) {
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, emulator)) {
            return false;
        }
        emulator.memory[0] += argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }
}
class Sub extends OperationInst {
    execute(argument, emulator) {
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, emulator)) {
            return false;
        }
        emulator.memory[0] -= argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }
}
class Mult extends OperationInst {
    execute(argument, emulator) {
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, emulator)) {
            return false;
        }
        emulator.memory[0] *= argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }
}
class Div extends OperationInst {
    validateDivisor(argument, emulator) {
        if (argument.getCellValue(emulator) === 0) {
            emulator.errors.push(new ZeroDivisionError(emulator.execHead));
            return false;
        }
        return true;
    }
    execute(argument, emulator) {
        if (!super.validateAccumulatorDefinition(emulator)) {
            return false;
        }
        if (!this.validateDivisor(argument, emulator)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, emulator)) {
            return false;
        }
        emulator.memory[0] /= argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }
}
class Halt extends Instruction {
    execute(argument, emulator) {
        emulator.execHead = emulator.parser.programLength;
        return true;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        return (argument instanceof NullArgument);
    }
}
export class NullInstruction extends Instruction {
    execute(argument, emulator) {
        return true;
    }
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