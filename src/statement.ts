import {Label} from "./label.js";
import {Instruction, Instructions} from "./instruction.js";
import {Argument} from "./argument.js";
import {Emulator} from "./emulator.js";
import { Parser } from "./parser.js";
import { Error_ } from "./exceptions.js";


class Statement {
    index: number;
    label: Label;
    instruction: Instruction;
    argument: Argument;
    constructor(
        index: number,
        label: Label, 
        instruction: Instruction, 
        argument: Argument
    )
    {
        this.index = index;
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
    validate(parser: Parser): [boolean, Error_[]]{
        let status = true;
        const errors: Error_[] = [];
        const labelIds = parser.contents.map((statement: Statement) => statement.label.id);
        (([s, e]: [boolean, Error_[]]) => {
            status = s;
            errors.push(...e)
        })(this.label.validate(this.index, labelIds));

        (([s, e]: [boolean, Error_[]]) => {
            status = s;
            errors.push(...e)
        })(this.argument.validate(this.index));


        (([s, e]: [boolean, Error_[]]) => {
            status = s;
            errors.push(...e)
        })(this.instruction.validate(this.index, this.argument));
        return [status, errors]
    }
    
}

export {Statement};