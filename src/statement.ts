import {Label} from "./label.js";
import {Instruction, Instructions} from "./instruction.js";
import {Argument} from "./argument.js";
import {Parser} from "./parser.js";



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

    execute(parser: Parser){
        if (typeof this.instruction === "undefined"){
            parser.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, parser);
    }

    
}

export {Statement};