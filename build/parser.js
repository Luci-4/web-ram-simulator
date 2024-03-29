import { Instruction } from "./instruction.js";
import { Label } from "./label.js";
import { Argument } from "./argument.js";
import Statement from "./statement.js";
import { UnexpectedTokenError, UnidentifiedInstructionError } from "./errors.js";
import StatementArray from "./statementArray.js";
export default class Parser {
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
            errors.push(new UnexpectedTokenError(lineIndex, elements.length));
            status = false;
        }
        // TODO: add validation for the instruction being in the third place
        if (instrInd < 0) {
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
        const statements = new StatementArray();
        const errors = [];
        linesOfElements.forEach((elements, lineIndex) => {
            const instrInd = Parser.identifyInstruction(elements);
            let elementErrors;
            let elementStatus;
            [elementStatus, elementErrors] = Parser.validateElements(elements, lineIndex, instrInd);
            status = elementStatus ? status : elementStatus;
            let statement = Parser.generateStatement(elementStatus, elements, lineIndex, instrInd);
            let statementErrors;
            let statementValidationStatus;
            [statementValidationStatus, statementErrors] = statement.parseValidate(statements.getLabelIds());
            status = statementValidationStatus ? status : statementValidationStatus;
            statements.add(statement);
            errors.push(...elementErrors, ...statementErrors);
        });
        return [status, errors, statements];
    }
    static generateStatement(canBePopulated, elements, lineIndex, instrIndex) {
        const statement = new Statement(lineIndex);
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