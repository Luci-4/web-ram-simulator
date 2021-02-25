import {Label} from "./label";
import {Instruction, Instructions} from "./instruction";
import {Argument} from "./argument";
import {App} from "./main";



class Statement {
    label: Label | undefined;
    instruction: Instruction;
    argument: Argument | undefined;
    constructor(
        label: Label | undefined, 
        instruction: Instruction, 
        argument: Argument | undefined)
    {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
    }

    execute(app: App){
        return this.instruction.execute(this.argument, app);
    }

    
}

export {Statement};