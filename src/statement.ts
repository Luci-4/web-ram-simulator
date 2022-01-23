import {Label} from "./label.js";
import {Instruction, Instructions} from "./instruction.js";
import {Argument} from "./argument.js";
import {Emulator} from "./emulator.js";



class Statement {
    label: Label | undefined;
    instruction: Instruction | undefined;
    argument: Argument | undefined;
    constructor(
        label: Label | undefined, 
        instruction: Instruction | undefined, 
        argument: Argument | undefined)
    {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
    }

    execute(emulator: Emulator){
        if (typeof this.instruction === "undefined"){
            emulator.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, emulator);
    }

    
}

export {Statement};