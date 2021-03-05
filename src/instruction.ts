import {Argument, CellArgument, ReferenceArgument, LabelArg, Address, Integer, Pointer} from "./argument.js";
import {Token} from "./token.js";
import {Parser} from "./parser.js";
import { LabelNotFoundError, UndefinedAccumulatorError, UndefinedCellError, UndefinedInputError, ZeroDivisionError} from "./exceptions.js";

abstract class Instruction extends Token{
    abstract execute(argument: Argument | undefined, parser: Parser): boolean;
    abstract validateArgument(token: Token): boolean;
    validateAccumulatorDefinition(parser: Parser): boolean{
        if(typeof parser.memory[0] === 'undefined'){
            let message = UndefinedAccumulatorError.generateMessage(parser.execHead);
            parser.debugConsole.push(message);
            return false;
        }
        return true;
    }
    static GenerateInstruction(text: string){
       
        return new Instructions[text]();
    }

    static validateInstruction(text) {
        if(Instructions.hasOwnProperty(text)){
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

    validateLabelsExistance(labelId: string, parser: Parser): boolean{
        if (!parser.lexer.labelsWithIndices.hasOwnProperty(labelId)){
            let message = LabelNotFoundError.generateMessage(parser.execHead, labelId);
            parser.debugConsole.push(message);
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

    validateCellDefinition(argument: CellArgument, parser: Parser): boolean{
        
        if(typeof argument.getCellValue(parser) === 'undefined'){
            let message = UndefinedCellError.generateMessage(parser.execHead);
            parser.debugConsole.push(message);
            return false;
        }
        return true;
    }

}

class Jump extends JumpInstr{
    execute(argument: LabelArg, parser: Parser): boolean{
        if (!this.validateLabelsExistance(argument.value, parser)){return false;}

        parser.execHead = argument.getLabelIndex(parser);
        return true;
    }

}

class Jgtz extends JumpInstr {
    execute(argument: LabelArg, parser: Parser): boolean {
        if(!this.validateLabelsExistance(argument.value, parser)){return false;}

        if (!super.validateAccumulatorDefinition(parser)){return false}

        if(parser.memory[0] > 0) {
            parser.execHead = parser.lexer.labelsWithIndices[argument.value];
        }
        return true;

    }

}

class Jzero extends JumpInstr {
    execute(argument: LabelArg, parser: Parser): boolean {
        if(!this.validateLabelsExistance(argument.value, parser)){
            
            return false;
        }

        if(!super.validateAccumulatorDefinition(parser)){
            return false;
        }

        if(parser.memory[0] === 0){
            parser.execHead = parser.lexer.labelsWithIndices[argument.value];
        }
        return true;
    }
}

class Read extends OperationInst {
    execute(argument: ReferenceArgument, parser: Parser): boolean {
        if (!this.validateInputDefinition(argument, parser)){
            
            return false;
        }
        let address = argument.getAddress(parser);
        parser.memory[address] = parser.inputs[parser.inputHead];
        parser.inputHead++;
        parser.execHead++;
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

    validateInputDefinition(argument: ReferenceArgument, parser: Parser): boolean {
        if(typeof parser.inputs[parser.inputHead] === 'undefined'){
            parser.debugConsole.push(UndefinedInputError.generateMessage(parser.execHead+1));
            return false;
        }
        else{
            return true;
        }

    }
}

class Write extends OperationInst {
    execute(argument: CellArgument, parser: Parser): boolean {
        if (!super.validateCellDefinition(argument, parser)){return false;}

        parser.outputs[parser.outputHead] = argument.getCellValue(parser);
        parser.outputHead++;
        parser.execHead++;
        return true;
    }


}

class Load extends OperationInst {
    execute(argument: CellArgument, parser: Parser): boolean {
        if (!super.validateCellDefinition(argument, parser)){return false;}
        
        parser.memory[0] = argument.getCellValue(parser);;
        parser.execHead++;
        return true;
    }
}

class Store extends OperationInst {

    execute(argument: ReferenceArgument, parser: Parser): boolean {

        if(!super.validateAccumulatorDefinition(parser)){return false;}

        parser.memory[argument.getAddress(parser)] = parser.memory[0];
        parser.execHead++;
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
    execute(argument: CellArgument,parser: Parser): boolean {
        if(!super.validateAccumulatorDefinition(parser)){return false;}

        if (!super.validateCellDefinition(argument, parser)){return false;}

        parser.memory[0] += argument.getCellValue(parser);
        parser.execHead++;
        return true;
    }

    
}

class Sub extends OperationInst {
    execute(argument: CellArgument, parser: Parser): boolean {
        
        if(!super.validateAccumulatorDefinition(parser)){return false;}
        
        if (!super.validateCellDefinition(argument, parser)){return false;}
        
        parser.memory[0] -= argument.getCellValue(parser);
        parser.execHead++;
        return true;
    }

}

class Mult extends OperationInst {
    execute(argument: CellArgument, parser: Parser): boolean {
        if(!super.validateAccumulatorDefinition(parser)){return false;}
        
        if (!super.validateCellDefinition(argument, parser)){return false;}

        parser.memory[0] *= argument.getCellValue(parser);
        parser.execHead++;
        return true;
    }

}

class Div extends OperationInst {

    validateDivisor(argument: CellArgument, parser: Parser){
        if(argument.getCellValue(parser) === 0){
            parser.debugConsole.push(ZeroDivisionError.generateMessage(parser.execHead));
            return false;
        }
        return true;
    }

    execute(argument: CellArgument, parser: Parser): boolean {
        if(!super.validateAccumulatorDefinition(parser)){return false;}
        if(!this.validateDivisor(argument, parser)){return false}
        if (!super.validateCellDefinition(argument, parser)){return false;}

        parser.memory[0] /= argument.getCellValue(parser);
        parser.execHead++;
        return true;
    }

}

class Halt extends Instruction {
    execute(argument: Argument | undefined, parser: Parser): boolean {
        parser.execHead = parser.lexer.programLength;
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