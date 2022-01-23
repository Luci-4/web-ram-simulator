import {Instruction} from "./instruction.js";
import {Label, PopulatedLabel} from "./label.js";
import {Argument} from "./argument.js";
import { Statement } from "./statement.js";
import { 
    UnexpectedTokenError, 
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

    GenerateTokens(elements: string[], lineIndex: number): Statement{
        const statement = new Statement(lineIndex);

        if(elements.length > 3){
            this.errors.push(new UnexpectedTokenError(lineIndex, elements.length))
            return statement;
        }
        const instrInd: number = this.IdentifyInstruction(elements); 

        if (instrInd < 0){
            this.errors.push(new UnidentifiedInstructionError(lineIndex))
            return statement;
        }
        const labelInd = instrInd - 1;
        const argumentInd = instrInd + 1;
        statement.populate(
            Label.Generate(elements[labelInd]),
            Instruction.Generate(elements[instrInd]),
            Argument.Generate(elements[argumentInd])
        )
        const [status, errors] = statement.validate(this)
        if(!status){
            this.errors.push(...errors);
        }
        return statement;

    }

    generateLabelsMap(){
        // swap contents' indices with tokens labels' ids to create labelsWithIndices
        
        Object.keys(this.contents).forEach((key: string) => {
            if(typeof key !== 'undefined'){
                let index: number = parseInt(key);
                let statement = this.contents[index]
                let labelId: string | undefined = statement.label.id; 
                
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