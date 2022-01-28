import { Instruction } from "./instruction.js";
import { Label } from "./label.js";
import { Argument } from "./argument.js";
import { Statement } from "./statement.js";
import { UnexpectedTokenError, UnidentifiedInstructionError } from "./exceptions.js";
export class Parser {
    static identifyInstruction(elements) {
        for (let elemInd = 0; elemInd < elements.length; elemInd++) {
            if (Instruction.validateInstruction(elements[elemInd])) {
                return elemInd;
            }
        }
        return -1;
    }
    static validateElements(elements, lineIndex, instrInd) {
        let status = true;
        const errors = [];
        if (elements.length > 3) {
            console.log("HELLO THEREapparently more than 3", elements.length);
            errors.push(new UnexpectedTokenError(lineIndex, elements.length));
            status = false;
        }
        // TODO: add validation for the instruction being in the third place
        if (instrInd < 0) {
            console.log("HELLO THEREapparently could not find the instruction", instrInd);
            errors.push(new UnidentifiedInstructionError(lineIndex));
            status = false;
        }
        return [status, errors];
    }
    static splitToLinesOfElements(program) {
        const lines = program.split("\n");
        const linesTrimmed = lines.map((l) => l.trim());
        const elements = linesTrimmed.map((l) => l.split(" "));
        return elements;
    }
    static parse(program) {
        let status = true;
        const linesOfElements = Parser.splitToLinesOfElements(program);
        const statements = [];
        const errors = [];
        linesOfElements.forEach((elements, lineIndex) => {
            const instrInd = Parser.identifyInstruction(elements);
            let elementErrors;
            let elementStatus;
            [elementStatus, elementErrors] = Parser.validateElements(elements, lineIndex, instrInd);
            status = elementStatus ? status : elementStatus;
            console.log("HERE", status);
            let statement = Parser.generateStatement(elementStatus, elements, lineIndex + 1, instrInd);
            console.log(statement);
            let statementErrors;
            let statementValidationStatus;
            [statementValidationStatus, statementErrors] = statement.parseValidate(statements);
            status = statementValidationStatus ? status : statementValidationStatus;
            statements.push(statement);
            errors.push(...elementErrors, ...statementErrors);
        });
        return [status, errors, statements];
    }
    static generateStatement(canBePopulated, elements, lineNumber, instrIndex) {
        const statement = new Statement(lineNumber);
        if (!canBePopulated) {
            return statement;
        }
        const labelInd = instrIndex - 1;
        const argumentInd = instrIndex + 1;
        statement.populate(Label.Generate(elements[labelInd]), Instruction.Generate(elements[instrIndex]), Argument.Generate(elements[argumentInd]));
        return statement;
    }
}
//# sourceMappingURL=parser.js.map