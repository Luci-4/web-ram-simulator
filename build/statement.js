import { NullLabel } from "./label.js";
import { NullInstruction } from "./instruction.js";
import { NullArgument } from "./argument.js";
class Statement {
    constructor(index) {
        this.label = new NullLabel();
        this.instruction = new NullInstruction();
        this.argument = new NullArgument();
        this.isValid = false;
        this.isPopulated = false;
        this.index = index;
    }
    populate(label, instruction, argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
        this.isPopulated = true;
    }
    execute(emulator) {
        if (this.instruction instanceof NullInstruction) {
            emulator.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, emulator);
    }
    parseValidate(allStatements) {
        let status = true;
        const labelIds = allStatements.map((statement) => statement.label.id);
        let labelErrors;
        let labelStatus;
        [labelStatus, labelErrors] = this.label.parseValidate(this.index, labelIds);
        status = labelStatus ? status : labelStatus;
        let argumentErrors;
        let argumentStatus;
        [argumentStatus, argumentErrors] = this.argument.parseValidate(this.index);
        status = argumentStatus ? status : argumentStatus;
        let instructionErrors = [];
        if (argumentStatus) {
            console.log("current status before validting instruction", this.instruction, status);
            let instructionStatus;
            [instructionStatus, instructionErrors] = this.instruction.parseValidate(this.index, this.argument);
            status = instructionStatus ? status : instructionStatus;
        }
        console.log("parse validate statement", this, status, instructionErrors);
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
export { Statement };
//# sourceMappingURL=statement.js.map