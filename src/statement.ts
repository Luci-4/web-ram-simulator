import {Label, NullLabel} from "./label.js";
import {Instruction, Instructions, NullInstruction} from "./instruction.js";
import {Argument, NullArgument} from "./argument.js";
import Emulator from "./emulator.js";
import Parser from "./parser.js";
import { Error_ } from "./errors.js";

export default class Statement {
    index: number;
    label: Label = new NullLabel();
    instruction: Instruction = new NullInstruction();
    argument: Argument = new NullArgument();
    isValid: boolean = false;
    isPopulated: boolean = false;
    constructor(index: number)
    {
        this.index = index;
    }

    populate(label: Label, instruction: Instruction, argument: Argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
        this.isPopulated = true;
    }

    execute(emulator: Emulator): [boolean, Error_[]] {
        if (this.instruction instanceof NullInstruction) {
            emulator.execHead++;
            return [true, []];
        }
        return this.instruction.execute(this.argument, emulator);
    }

    parseValidate(labelIds: Array<string | undefined>): [boolean, Error_[]] {
        let status = true;

        let labelErrors: Error_[];
        let labelStatus: boolean;
        [labelStatus, labelErrors] = this.label.parseValidate(this.index, labelIds); 
        status = labelStatus ? status : labelStatus;

        let argumentErrors: Error_[];
        let argumentStatus: boolean;
        [argumentStatus, argumentErrors] = this.argument.parseValidate(this.index);
        status = argumentStatus ? status : argumentStatus;

        let instructionErrors: Error_[] = [];
        if (argumentStatus) {
            let instructionStatus: boolean;
            [instructionStatus, instructionErrors] = this.instruction.parseValidate(this.index, this.argument);
            status = instructionStatus ? status : instructionStatus;
        }


        this.isValid = status;

        return [
            status, 
            [
                ...labelErrors, 
                ...argumentErrors, 
                ...instructionErrors
            ]
        ];
    }
    
}