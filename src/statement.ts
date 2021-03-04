import {Label} from "./label.js";
import {Instruction, Instructions} from "./instruction.js";
import {Argument} from "./argument.js";
import {App} from "./main.js";



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

    execute(app: App){
        if (typeof this.instruction === "undefined"){
            app.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, app);
    }

    
}

export {Statement};