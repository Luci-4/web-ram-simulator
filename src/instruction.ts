import {Argument, CellArgument, ReferenceArgument, LabelArg, Address, Integer, Pointer} from "./argument.js";
import {Token} from "./token.js";
import {Emulator} from "./emulator.js";
import { LabelNotFoundError, UndefinedAccumulatorError, UndefinedCellError, UndefinedInputError, ZeroDivisionError} from "./exceptions.js";

abstract class Instruction extends Token{
    abstract execute(argument: Argument | undefined, emulator: Emulator): boolean;
    abstract validateArgument(token: Token): boolean;
    validateAccumulatorDefinition(emulator: Emulator): boolean{
        if(typeof emulator.memory[0] === 'undefined'){
            let message = UndefinedAccumulatorError.generateMessage(emulator.execHead);
            emulator.debugConsole.push(message);
            return false;
        }
        return true;
    }
    static GenerateInstruction(text: string){
       
        return new Instructions[text.toLowerCase()]();
    }

    static validateInstruction(text) {
        if(Instructions.hasOwnProperty(text.toLowerCase())){
            return true;
        }
        return false;
    }
}

abstract class JumpInstr extends Instruction {

    validateArgument(argument: Argument): boolean{
      if(argument instanceof LabelArg){
          return true;
      }
      return false;
      
    }

    validateLabelsExistance(labelId: string, emulator: Emulator): boolean{
        if (!emulator.lexer.labelsWithIndices.hasOwnProperty(labelId)){
            let message = LabelNotFoundError.generateMessage(emulator.execHead, labelId);
            emulator.debugConsole.push(message);
            return false;
        }
        return true;
        
    }
}


abstract class OperationInst extends Instruction {
    validateArgument(argument: Argument): boolean {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if(argument instanceof CellArgument){
            return true;
        }
        return false;
    }

    validateCellDefinition(argument: CellArgument, emulator: Emulator): boolean{
        
        if(typeof argument.getCellValue(emulator) === 'undefined'){
            let message = UndefinedCellError.generateMessage(emulator.execHead);
            emulator.debugConsole.push(message);
            return false;
        }
        return true;
    }

}

class Jump extends JumpInstr{
    execute(argument: LabelArg, emulator: Emulator): boolean{
        if (!this.validateLabelsExistance(argument.value, emulator)){return false;}

        emulator.execHead = argument.getLabelIndex(emulator);
        return true;
    }

}

class Jgtz extends JumpInstr {
    execute(argument: LabelArg, emulator: Emulator): boolean {
        if(!this.validateLabelsExistance(argument.value, emulator)){return false;}

        if (!super.validateAccumulatorDefinition(emulator)){return false}
        if(emulator.memory[0] > 0) {
            
            emulator.execHead = emulator.lexer.labelsWithIndices[argument.value];
        }
        else {
            emulator.execHead++;
        }
        return true;

    }

}

class Jzero extends JumpInstr {
    execute(argument: LabelArg, emulator: Emulator): boolean {
        if(!this.validateLabelsExistance(argument.value, emulator)){
            
            return false;
        }

        if(!super.validateAccumulatorDefinition(emulator)){
            return false;
        }

        if(emulator.memory[0] === 0){
            emulator.execHead = emulator.lexer.labelsWithIndices[argument.value];
        }
        else {
            emulator.execHead++;
        }
        return true;
    }
}

class Read extends OperationInst {
    execute(argument: ReferenceArgument, emulator: Emulator): boolean {
        if (!this.validateInputDefinition(argument, emulator)){
            
            return false;
        }
        let address = argument.getAddress(emulator);
        emulator.memory[address] = emulator.inputs[emulator.inputHead];
        emulator.inputHead++;
        emulator.execHead++;
        return true;
    }

    validateArgument(argument: Argument): boolean {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if(argument instanceof ReferenceArgument){
            return true;
        }
        else{
            return false;
        }
    }

    validateInputDefinition(argument: ReferenceArgument, emulator: Emulator): boolean {
        if(typeof emulator.inputs[emulator.inputHead] === 'undefined'){
            emulator.debugConsole.push(UndefinedInputError.generateMessage(emulator.execHead+1));
            return false;
        }
        else{
            return true;
        }

    }
}

class Write extends OperationInst {
    execute(argument: CellArgument, emulator: Emulator): boolean {
        if (!super.validateCellDefinition(argument, emulator)){return false;}

        emulator.outputs[emulator.outputHead] = argument.getCellValue(emulator);
        emulator.outputHead++;
        emulator.execHead++;
        return true;
    }


}

class Load extends OperationInst {
    execute(argument: CellArgument, emulator: Emulator): boolean {
        if (!super.validateCellDefinition(argument, emulator)){return false;}
        
        emulator.memory[0] = argument.getCellValue(emulator);;
        emulator.execHead++;
        return true;
    }
}

class Store extends OperationInst {

    execute(argument: ReferenceArgument, emulator: Emulator): boolean {

        if(!super.validateAccumulatorDefinition(emulator)){return false;}

        emulator.memory[argument.getAddress(emulator)] = emulator.memory[0];
        emulator.execHead++;
        return true;
    }

    validateArgument(argument: Argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if(argument instanceof ReferenceArgument){
            return true;
        }
        else{
            return false;
        }
    }

}

class Add extends OperationInst {
    execute(argument: CellArgument,emulator: Emulator): boolean {
        if(!super.validateAccumulatorDefinition(emulator)){return false;}

        if (!super.validateCellDefinition(argument, emulator)){return false;}

        emulator.memory[0] += argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }

    
}

class Sub extends OperationInst {
    execute(argument: CellArgument, emulator: Emulator): boolean {
        
        if(!super.validateAccumulatorDefinition(emulator)){return false;}
        
        if (!super.validateCellDefinition(argument, emulator)){return false;}
        
        emulator.memory[0] -= argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }

}

class Mult extends OperationInst {
    execute(argument: CellArgument, emulator: Emulator): boolean {
        if(!super.validateAccumulatorDefinition(emulator)){return false;}
        
        if (!super.validateCellDefinition(argument, emulator)){return false;}

        emulator.memory[0] *= argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }

}

class Div extends OperationInst {

    validateDivisor(argument: CellArgument, emulator: Emulator){
        if(argument.getCellValue(emulator) === 0){
            emulator.debugConsole.push(ZeroDivisionError.generateMessage(emulator.execHead));
            return false;
        }
        return true;
    }

    execute(argument: CellArgument, emulator: Emulator): boolean {
        if(!super.validateAccumulatorDefinition(emulator)){return false;}
        if(!this.validateDivisor(argument, emulator)){return false}
        if (!super.validateCellDefinition(argument, emulator)){return false;}

        emulator.memory[0] /= argument.getCellValue(emulator);
        emulator.execHead++;
        return true;
    }

}

class Halt extends Instruction {
    execute(argument: Argument | undefined, emulator: Emulator): boolean {
        emulator.execHead = emulator.lexer.programLength;
        return true;
    }

    validateArgument(argument: Argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if(typeof argument === 'undefined'){
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


export {Instruction, Instructions};