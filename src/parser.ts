import {Instruction} from "./instruction.js";
import {Label, PopulatedLabel} from "./label.js";
import {Argument} from "./argument.js";
import Statement from "./statement.js";
import { 
    UnexpectedTokenError, 
    Error_,
    UnidentifiedInstructionError
} from "./errors.js"
import StatementArray from "./statementArray.js";


export default class Parser {
    programLength: number;
    labelsWithIndices: {[key: string]: number};

    private static identifyInstruction(elements: string[]): number {
        for(let elemInd = 0; elemInd < elements.length; elemInd++) {
            if (Instruction.validateInstruction(elements[elemInd])) {
                return elemInd;
            }
        }
        return -1;
    }

    private static validateElements(elements: string[], lineIndex: number, instrInd: number): [boolean, Error_[]]{
        let status = true;
        const errors: Error_[] = [];
        if (elements.length > 3) {
            errors.push(new UnexpectedTokenError(lineIndex, elements.length))
            status = false;
        }
        // TODO: add validation for the instruction being in the third place
        if (instrInd < 0) {
            
            errors.push(new UnidentifiedInstructionError(lineIndex))
            status = false
        }
        return [status, errors];
    }

    private static splitToLinesOfElements(program: string): string[][]{

        const lines = program.split("\n");
        
        const linesTrimmed = lines.map((l: string) => l.trim());
        const elements = linesTrimmed.map((l: string) => l.split(" "))
        
        return elements;
    }

    static parse(program: string): [boolean, Error_[], StatementArray]{
        let status: boolean = true;
        const linesOfElements = Parser.splitToLinesOfElements(program);
        const statements = new StatementArray();
        const errors: Error_[] = [];
        linesOfElements.forEach((elements: string[], lineIndex: number) => {
            const instrInd = Parser.identifyInstruction(elements);

            let elementErrors: Error_[];
            let elementStatus: boolean;
            [elementStatus, elementErrors] = Parser.validateElements(elements, lineIndex, instrInd);
            status = elementStatus ? status : elementStatus;

            let statement = Parser.generateStatement(elementStatus, elements, lineIndex, instrInd);
            let statementErrors: Error_[];
            let statementValidationStatus: boolean;
            [statementValidationStatus, statementErrors] = statement.parseValidate(statements.getLabelIds());
            status = statementValidationStatus ? status : statementValidationStatus;

            statements.add(statement);
            errors.push(...elementErrors, ...statementErrors);
        });
        return [status, errors, statements];
    }

    private static generateStatement(canBePopulated: boolean, elements: string[], lineIndex: number, instrIndex: number): Statement{
        const statement = new Statement(lineIndex);
        if (!canBePopulated) {
            return statement;
        }
        const labelInd = instrIndex - 1;
        const argumentInd = instrIndex + 1;
        statement.populate(
            Label.Generate(elements[labelInd]),
            Instruction.Generate(elements[instrIndex]),
            Argument.Generate(elements[argumentInd])
        )
        return statement;
    }
}