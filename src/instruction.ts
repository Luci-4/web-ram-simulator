import {Argument, CellArgument, ReferenceArgument, LabelArg, Address, Integer, Pointer} from "./argument";
import {Token} from "./token";
import {App} from "./main";
import { LabelNotFoundError, UndefinedAccumulatorError, UndefinedCellError } from "./exceptions";

abstract class Instruction extends Token{
    abstract execute(argument: Argument | undefined, app: App): boolean;
    abstract validateArgument(token: Token): boolean;
    validateAccumulatorDefinition(app: App): boolean{
        if(typeof app.memory[0] === 'undefined'){
            let message = UndefinedAccumulatorError.generateMessage(app.execHead);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    }
    static GenerateInstruction(text: string){
        return new Instructions[text]();
    }
}

abstract class JumpInstr extends Instruction {

    validateArgument(argument: Argument): boolean{
      if(argument instanceof LabelArg){
          return true;
      }
      return false;
      
    }

    validateLabelsExistance(labelId: string, app: App): boolean{
        if (!app.lexer.labelsWithIndices.hasOwnProperty(labelId)){
            let message = LabelNotFoundError.generateMessage(app.execHead, labelId);
            app.debugConsole.push(message);
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

    validateCellDefinition(argument: CellArgument, app: App): boolean{
        if(typeof argument.getCellValue(app) === 'undefined'){
            let message = UndefinedCellError.generateMessage(app.execHead);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    }

}

class Jump extends JumpInstr{
    execute(argument: LabelArg, app: App): boolean{
        if (!this.validateLabelsExistance(argument.value, app)){return false;}

        app.execHead = argument.getLabelIndex(app);
        return true;
    }

}

class Jgtz extends JumpInstr {
    execute(argument: LabelArg, app: App): boolean {
        if(!this.validateLabelsExistance(argument.value, app)){return false;}

        if (!super.validateAccumulatorDefinition(app)){return false}

        if(app.memory[0] > 0) {
            app.execHead = app.lexer.labelsWithIndices[argument.value];
        }
        return true;

    }

}

class Jzero extends JumpInstr {
    execute(argument: LabelArg, app: App): boolean {
        if(!this.validateLabelsExistance(argument.value, app)){return false;}

        if(!super.validateAccumulatorDefinition(app)){return false;}

        if(app.memory[0] === 0){
            app.execHead = app.lexer.labelsWithIndices[argument.value];
        }
        return true;
    }
}

class Read extends OperationInst {
    execute(argument: ReferenceArgument, app: App): boolean {
        if (!this.validateInputDefinition(argument, app)){
            return false;
        }
        let address = argument.getAddress(app);
        app.memory[address] = app.inputs[app.inputHead];
        app.inputHead++;
        app.execHead++;
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

    validateInputDefinition(argument: ReferenceArgument, app: App): boolean {
        if(typeof app.inputs[app.inputHead] === 'undefined'){
            return false;
        }
        else{
            return true;
        }

    }
}

class Write extends OperationInst {
    execute(argument: CellArgument, app: App): boolean {
        if (!super.validateCellDefinition(argument, app)){return false;}

        app.outputs[app.outputHead] = argument.getCellValue(app);
        app.outputHead++;
        app.execHead++;
        return true;
    }


}

class Load extends OperationInst {
    execute(argument: CellArgument, app: App): boolean {
        if (!super.validateCellDefinition(argument, app)){return false;}
        
        app.memory[0] = argument.getCellValue(app);;
        app.execHead++;
        return true;
    }
}

class Store extends OperationInst {

    execute(argument: ReferenceArgument, app: App): boolean {

        if(!super.validateAccumulatorDefinition(app)){return false;}

        app.memory[argument.getAddress(app)] = app.memory[0];
        app.execHead++;
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
    execute(argument: CellArgument,app: App): boolean {
        if(!super.validateAccumulatorDefinition(app)){return false;}

        if (!super.validateCellDefinition(argument, app)){return false;}

        app.memory[0] += argument.getCellValue(app);
        app.execHead++;
        return true;
    }

    
}

class Sub extends OperationInst {
    execute(argument: CellArgument, app: App): boolean {
        
        if(!super.validateAccumulatorDefinition(app)){return false;}
        
        if (!super.validateCellDefinition(argument, app)){return false;}
        
        app.memory[0] -= argument.getCellValue(app);
        app.execHead++;
        return true;
    }

}

class Mult extends OperationInst {
    execute(argument: CellArgument, app: App): boolean {
        if(!super.validateAccumulatorDefinition(app)){return false;}
        
        if (!super.validateCellDefinition(argument, app)){return false;}

        app.memory[0] *= argument.getCellValue(app);
        app.execHead++;
        return true;
    }

}

class Div extends OperationInst {
    execute(argument: CellArgument, app: App): boolean {
        if(!super.validateAccumulatorDefinition(app)){return false;}
        
        if (!super.validateCellDefinition(argument, app)){return false;}

        app.memory[0] /= argument.getCellValue(app);
        app.execHead++;
        return true;
    }

}

class Halt extends Instruction {
    execute(argument: Argument | undefined, app: App): boolean {
        app.execHead = app.lexer.programLength;
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