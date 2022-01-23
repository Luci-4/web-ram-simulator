import { Instruction } from "./instruction.js";
import {Parser} from "./parser.js";
import {Token} from "./token.js";

abstract class Argument extends Token{

    static GenerateArgument(text: string | undefined){
        if (typeof text === "undefined"){
            return new ArgumentsTypes["null"]();
        }
        else if(/^[0-9]+$/.test(text)){
            return new ArgumentsTypes["address"](text);
        }
    
        else if(text[0] === "="){
            return new ArgumentsTypes["integer"](text.slice(1));
        }
    
        else if(text[0] === "^"){
            return new ArgumentsTypes["pointer"](text.slice(1));
        }
    
        else {
            return new ArgumentsTypes["label"](text);
        }
    }
}
class Null extends Argument{

}
abstract class PopulatedArgument extends Argument{
    value: string;
    validateValue(){
        
        if(this.value.length === 0 || isNaN(Number(this.value))){
            return false;
        }
        return true;
    }
    constructor(value: string){
        super();
        this.value = value;
    }

    
}

abstract class CellArgument extends PopulatedArgument{
    abstract getCellValue(parser: Parser): number;
}

abstract class ReferenceArgument extends CellArgument {
    abstract getAddress(parser: Parser): number;
}

class LabelArg extends PopulatedArgument{
    value: string;
    validateValue(){
        if(this.value.length > 0){
            return true;
        }
        return false;
    }
    getLabelIndex(parser: Parser){
        return parser.lexer.labelsWithIndices[this.value];
    }
}

class Integer extends CellArgument {
    
    getCellValue(parser: Parser){
        return parseInt(this.value);
    }
}

class Address extends ReferenceArgument {
    getCellValue(parser: Parser){
        return parser.memory[parseInt(this.value)];
    }

    getAddress(parser: Parser){
        return parseInt(this.value);
    }
}

class Pointer extends ReferenceArgument {
    getCellValue(parser: Parser){
        return parser.memory[parser.memory[parseInt(this.value)]];
    }

    getAddress(parser: Parser){
        return parser.memory[parseInt(this.value)];
    }
}

const ArgumentsTypes = {
    "null": Null,
    "address": Address,
    "integer": Integer, 
    "pointer": Pointer,
    "label": LabelArg
}


export {
    Argument,
    PopulatedArgument,
    Null,
    CellArgument,
    ReferenceArgument,
    LabelArg,
    Integer,
    Address,
    Pointer
};