import {Instruction, Instructions} from "./instruction.js";
import {Label} from "./label.js";
import {Argument} from "./argument.js";
import { Statement } from "./statement.js";
import {App} from "./main.js";
import {DuplicateLabelsError, 
    UnexpectedTokenError, 
    InvalidInstructionError, 
    InvalidArgumentError,
    InvalidArgumentValueError,
    EmptyArgumentError
} from "./exceptions.js"


export class Lexer {
    contents: (Statement | undefined)[];
    programLength: number;
    labelsWithIndices: {[key: string]: number};
    debugConsole: string[];

    constructor(contents: string) {
        this.debugConsole = [];
        // replace multiple whitespace characters with one space
        let lines: string[];
        lines = contents.split("\n");
        
        // remove whitespaces around every line
        lines = lines.map((line: string) => line.trim());
        lines.forEach(line => {
            console.log(line, line.length);
        })
       
        // remove empty lines
        // lines = lines.filter((n: string) => n);

        // convert lines to tokens
        this.contents = lines.map((line: string, index: number) => {
            let elements: string[] = line.split(" ");
            let statementNow = this.GenerateTokens(elements, index + 1);
            
            return statementNow;
        });

        this.programLength = this.contents.length;

        this.labelsWithIndices = {};
        
    }

    GenerateTokens(elements: string[], lineIndex: number): Statement | undefined{
        let label: Label | undefined;
        let instruction: Instruction | undefined;
        let argument: Argument | undefined;
        // todo: add error when there are duplicated labels
    
        if(elements.length > 3){
            let message = UnexpectedTokenError.generateMessage(lineIndex, elements.length);
            this.debugConsole.push(message);
            return undefined;
        }
        else if (elements.length === 3){
            label = new Label(elements[0]);
            if (!Instruction.validateInstruction(elements[1])){
                let message = InvalidInstructionError.generateMessage(lineIndex, elements[1])
                this.debugConsole.push(message);
                return undefined;
            }
            instruction = Instruction.GenerateInstruction(elements[1]);
            argument = Argument.GenerateArgument(elements[2]);
        }
        else if (elements.length === 2){
            if (Instructions.hasOwnProperty(elements[0])){
                label = new Label(undefined);
                if (!Instruction.validateInstruction(elements[0])){
                    let message = InvalidInstructionError.generateMessage(lineIndex, elements[0])
                    this.debugConsole.push(message);
                    return undefined;
                }
                instruction = Instruction.GenerateInstruction(elements[0]);
                argument = Argument.GenerateArgument(elements[1]);
            }
            else if (Instruction.validateInstruction(elements[1])){
                label = new Label(elements[0]);
                instruction = Instruction.GenerateInstruction(elements[1]);
            }
            else {
                let message = InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
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
                let message = InvalidInstructionError.generateMessage(lineIndex, elements[0]);
                this.debugConsole.push(message);
                return undefined;
            }
        }
        if (typeof instruction !== "undefined" && !instruction.validateArgument(argument)) {
            let message: string;
            if (typeof argument === 'undefined') {
                message = EmptyArgumentError.generateMessage(lineIndex, instruction);
            } else {
                message = InvalidArgumentError.generateMessage(lineIndex, argument, instruction);
                
            }
            this.debugConsole.push(message);
            return undefined;
        }

        if(typeof argument !== "undefined" && !argument.validateValue()){
            let message = InvalidArgumentValueError.generateMessage(lineIndex, argument);
            this.debugConsole.push(message);
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

    
}