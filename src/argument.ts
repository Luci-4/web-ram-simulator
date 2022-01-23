import {Emulator} from "./emulator.js";
import {Token} from "./token.js";
import { Error_, InvalidArgumentValueError } from "./exceptions.js";

abstract class Argument extends Token{

    value: string | undefined;
    constructor(value: string | undefined){
        super();
        this.value = value;
    }
    public static Generate(text: string | undefined): Argument{
        if (typeof text === "undefined"){
            return new ArgumentsTypes["null"](text);
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
    abstract validateValue(): boolean;

    validate(lineIndex: number): [boolean, Error_[]]{
        const errors: Error_[] = []
        let status = true;
        if(!this.validateValue()){
            errors.push(new InvalidArgumentValueError(lineIndex, this))
            status = false
        }
        
        return [status, errors]
    }
}
class NullArgument extends Argument{
    value: undefined; 
    validateValue(){
        if(typeof this.value === "undefined"){
            return true;

        }
        return false;
    }
}
abstract class PopulatedArgument extends Argument{
    value: string;
    validateValue(){
        
        if(this.value.length === 0 || isNaN(Number(this.value))){
            return false;
        }
        return true;
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
    "null": NullArgument,
    "address": Address,
    "integer": Integer, 
    "pointer": Pointer,
    "label": LabelArg
}


export {
    Argument,
    PopulatedArgument,
    NullArgument,
    CellArgument,
    ReferenceArgument,
    LabelArg,
    Integer,
    Address,
    Pointer
};