import { Instruction } from "./instruction.js";
import {Emulator} from "./emulator.js";
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
    abstract getCellValue(emulator: Emulator): number;
}

abstract class ReferenceArgument extends CellArgument {
    abstract getAddress(emulator: Emulator): number;
}

class LabelArg extends PopulatedArgument{
    value: string;
    validateValue(){
        if(this.value.length > 0){
            return true;
        }
        return false;
    }
    getLabelIndex(emulator: Emulator){
        return emulator.parser.labelsWithIndices[this.value];
    }
}

class Integer extends CellArgument {
    
    getCellValue(emulator: Emulator){
        return parseInt(this.value);
    }
}

class Address extends ReferenceArgument {
    getCellValue(emulator: Emulator){
        return emulator.memory[parseInt(this.value)];
    }

    getAddress(emulator: Emulator){
        return parseInt(this.value);
    }
}

class Pointer extends ReferenceArgument {
    getCellValue(emulator: Emulator){
        return emulator.memory[emulator.memory[parseInt(this.value)]];
    }

    getAddress(emulator: Emulator){
        return emulator.memory[parseInt(this.value)];
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