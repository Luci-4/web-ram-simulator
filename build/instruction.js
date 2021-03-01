"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructions = exports.Instruction = void 0;
const argument_1 = require("./argument");
const token_1 = require("./token");
const exceptions_1 = require("./exceptions");
class Instruction extends token_1.Token {
    validateAccumulatorDefinition(app) {
        if (typeof app.memory[0] === 'undefined') {
            let message = exceptions_1.UndefinedAccumulatorError.generateMessage(app.execHead);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    }
    static GenerateInstruction(text) {
        console.log("here: ", text);
        return new Instructions[text]();
    }
    static validateInstruction(text) {
        if (Instructions.hasOwnProperty(text)) {
            return true;
        }
        return false;
    }
}
exports.Instruction = Instruction;
class JumpInstr extends Instruction {
    validateArgument(argument) {
        if (argument instanceof argument_1.LabelArg) {
            return true;
        }
        return false;
    }
    validateLabelsExistance(labelId, app) {
        if (!app.lexer.labelsWithIndices.hasOwnProperty(labelId)) {
            let message = exceptions_1.LabelNotFoundError.generateMessage(app.execHead, labelId);
            app.debugConsole.push(message);
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
        if (argument instanceof argument_1.CellArgument) {
            return true;
        }
        return false;
    }
    validateCellDefinition(argument, app) {
        if (typeof argument.getCellValue(app) === 'undefined') {
            let message = exceptions_1.UndefinedCellError.generateMessage(app.execHead);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    }
}
class Jump extends JumpInstr {
    execute(argument, app) {
        if (!this.validateLabelsExistance(argument.value, app)) {
            return false;
        }
        app.execHead = argument.getLabelIndex(app);
        return true;
    }
}
class Jgtz extends JumpInstr {
    execute(argument, app) {
        if (!this.validateLabelsExistance(argument.value, app)) {
            return false;
        }
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        if (app.memory[0] > 0) {
            app.execHead = app.lexer.labelsWithIndices[argument.value];
        }
        return true;
    }
}
class Jzero extends JumpInstr {
    execute(argument, app) {
        if (!this.validateLabelsExistance(argument.value, app)) {
            return false;
        }
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        if (app.memory[0] === 0) {
            app.execHead = app.lexer.labelsWithIndices[argument.value];
        }
        return true;
    }
}
class Read extends OperationInst {
    execute(argument, app) {
        if (!this.validateInputDefinition(argument, app)) {
            return false;
        }
        let address = argument.getAddress(app);
        app.memory[address] = app.inputs[app.inputHead];
        app.inputHead++;
        app.execHead++;
        return true;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (argument instanceof argument_1.ReferenceArgument) {
            return true;
        }
        else {
            return false;
        }
    }
    validateInputDefinition(argument, app) {
        if (typeof app.inputs[app.inputHead] === 'undefined') {
            return false;
        }
        else {
            return true;
        }
    }
}
class Write extends OperationInst {
    execute(argument, app) {
        if (!super.validateCellDefinition(argument, app)) {
            return false;
        }
        app.outputs[app.outputHead] = argument.getCellValue(app);
        app.outputHead++;
        app.execHead++;
        return true;
    }
}
class Load extends OperationInst {
    execute(argument, app) {
        if (!super.validateCellDefinition(argument, app)) {
            return false;
        }
        app.memory[0] = argument.getCellValue(app);
        ;
        app.execHead++;
        return true;
    }
}
class Store extends OperationInst {
    execute(argument, app) {
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        app.memory[argument.getAddress(app)] = app.memory[0];
        app.execHead++;
        return true;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (argument instanceof argument_1.ReferenceArgument) {
            return true;
        }
        else {
            return false;
        }
    }
}
class Add extends OperationInst {
    execute(argument, app) {
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, app)) {
            return false;
        }
        app.memory[0] += argument.getCellValue(app);
        app.execHead++;
        return true;
    }
}
class Sub extends OperationInst {
    execute(argument, app) {
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, app)) {
            return false;
        }
        app.memory[0] -= argument.getCellValue(app);
        app.execHead++;
        return true;
    }
}
class Mult extends OperationInst {
    execute(argument, app) {
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, app)) {
            return false;
        }
        app.memory[0] *= argument.getCellValue(app);
        app.execHead++;
        return true;
    }
}
class Div extends OperationInst {
    execute(argument, app) {
        if (!super.validateAccumulatorDefinition(app)) {
            return false;
        }
        if (!super.validateCellDefinition(argument, app)) {
            return false;
        }
        app.memory[0] /= argument.getCellValue(app);
        app.execHead++;
        return true;
    }
}
class Halt extends Instruction {
    execute(argument, app) {
        app.execHead = app.lexer.programLength;
        return true;
    }
    validateArgument(argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (typeof argument === 'undefined') {
            return true;
        }
        return false;
    }
}
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
    "halt": Halt
};
exports.Instructions = Instructions;
//# sourceMappingURL=instruction.js.map