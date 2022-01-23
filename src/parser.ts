import {Instruction} from "./instruction.js";
import {Label, PopulatedLabel} from "./label.js";
import {Argument} from "./argument.js";
import { Statement } from "./statement.js";
import {DuplicateLabelsError, 
    UnexpectedTokenError, 
    InvalidInstructionError, 
    InvalidArgumentError,
    InvalidArgumentValueError,
    EmptyArgumentError,
    Error_,
    UnidentifiedInstructionError
} from "./exceptions.js"


export class Parser {
    contents: (Statement)[];
    programLength: number;
    labelsWithIndices: {[key: string]: number};
    errors: Array<Error_>;

    constructor(contents: string) {
        this.errors = [];
        this.contents = [];
        // replace multiple whitespace characters with one space
        let lines: string[];
        lines = contents.split("\n");
        
        // remove whitespaces around every line
        lines = lines.map((line: string) => line.trim());
        

        // convert lines to tokens
        lines.forEach((line: string, index: number) => {
            let elements: string[] = line.split(" ");
            let statementNow = this.GenerateTokens(elements, index + 1);
            
            this.contents.push(statementNow);
        });

        this.programLength = this.contents.length;

        this.labelsWithIndices = {};
        
    }
    IdentifyInstruction(elements: string[]): number{
        for(let elemInd = 0; elemInd < elements.length; elemInd++){
            if(Instruction.validateInstruction(elements[elemInd])){
                return elemInd;
            }
        }
        return -1;
    }

    GenerateTokens(elements: string[], lineIndex: number): Statement | undefined{
        // let label: Label | undefined;
        // let instruction: Instruction | undefined;
        // let argument: Argument | undefined;

        if(elements.length > 3){
            this.errors.push(new UnexpectedTokenError(lineIndex, elements.length))
            return undefined;
        }
        const instrInd: number = this.IdentifyInstruction(elements); 

        if (instrInd < 0){
            this.errors.push(new UnidentifiedInstructionError(lineIndex))
            return undefined;
        }
        const labelInd = instrInd - 1;
        const argumentInd = instrInd + 1;
        const statement = new Statement(
            lineIndex,
            Label.Generate(elements[labelInd]),
            Instruction.Generate(elements[instrInd]),
            Argument.Generate(elements[labelInd])
        )
        const [status, errors] = statement.validate(this)
        // ------------------ done till this point ----------------------

        if (elements.length === 3){
            label = new Label(elements[0]);
            if (!Instruction.validateInstruction(elements[1])){
                this.errors.push(new InvalidInstructionError(lineIndex, elements[1]))
                return undefined;
            }
            instruction = Instruction.GenerateInstruction(elements[1]);
            argument = Argument.GenerateArgument(elements[2]);
        }
        else if (elements.length === 2){
            // empty, instruction, argument
            if (Instruction.validateInstruction(elements[0])){
                label = new Label(undefined);
                instruction = Instruction.GenerateInstruction(elements[0]);
                argument = Argument.GenerateArgument(elements[1]);
            }
            // label, instruction, empty
            else if (Instruction.validateInstruction(elements[1])){
                label = new Label(elements[0]);
                instruction = Instruction.GenerateInstruction(elements[1]);
            }

            else {
                this.errors.push(new InvalidInstructionError(lineIndex, elements[0]))
                return undefined;
            }
        }
        else{
            if (Instruction.validateInstruction(elements[0])){
                label = new Label(undefined);
                instruction = Instruction.GenerateInstruction(elements[0])
            }
            // empty Statement for empty lines;
            else if(elements[0].length === 0){
                label = new Label(undefined);
                instruction = undefined;
                argument = undefined;
            }
            else {
                this.errors.push(new InvalidInstructionError(lineIndex, elements[0]))
                return undefined;
            }
        }
        if (typeof instruction !== "undefined" && !instruction.validateArgument(argument)) {
            let error: Error_;
            if (typeof argument === 'undefined') {
                error = new EmptyArgumentError(lineIndex, instruction);
            } else {
                error = new InvalidArgumentError(lineIndex, argument, instruction);
                
            }
            this.errors.push(error)
            return undefined;
        }

        if(typeof argument !== "undefined" && !argument.validateValue()){
            this.errors.push(new InvalidArgumentValueError(lineIndex, argument));
            return undefined;
        }

        if (!this.validateLabelUniqueness(label)) {
            this.errors.push(new DuplicateLabelsError(lineIndex, label));
            return undefined;
        }
        
        return new Statement(label, instruction, argument);
        
    }

    mapLabels(){
        // swap contents' indices with tokens labels' ids to create labelsWithIndices
        Object.keys(this.contents).forEach(key => {
            if(typeof key !== 'undefined'){
                let index: number = parseInt(key);
                let labelId: string | undefined = this.contents[key].label.id;
                
                // check if label if worth indexing
                if(typeof labelId !== "undefined"){
                    this.labelsWithIndices[labelId] = index;
                }
            }
        })
    }

    validateLabelUniqueness(label: Label){
        let labels: Array<string|undefined> = [];
        // TODO: fix autocomplete in the middle of other text
        this.contents.forEach(statement => {
            if(typeof statement?.label?.id !== "undefined"){
                labels.push(statement.label.id);
            }
            
        });
        if(labels.includes(label.id)){
            return false;
        }
        return true;
    }

    
}