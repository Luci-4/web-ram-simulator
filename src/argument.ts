import { Instruction } from "./instruction";
import {App} from "./main";
import {Token} from "./token";


abstract class Argument extends Token{
    value: string;
    validateValue(){
        if(/^[0-9]+$/.test(this.value)){
            return true;
        }
        return false;
    }
    constructor(value: string){
        super();
        this.value = value;
    }

    static GenerateArgument(text: string){
        if(/^[0-9]+$/.test(text)){
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

abstract class CellArgument extends Argument{
    abstract getCellValue(app: App): number;
}

abstract class ReferenceArgument extends CellArgument {
    abstract getAddress(app: App): number;
}

class LabelArg extends Argument{
    value: string;
    validateValue(){
        if(this.value){
            return true;
        }
        return false;
    }
    getLabelIndex(app: App){
        return app.lexer.labelsWithIndices[this.value];
    }
}

class Integer extends CellArgument {
    
    getCellValue(app: App){
        return parseInt(this.value);
    }
}

class Address extends ReferenceArgument {
    getCellValue(app: App){
        return app.memory[parseInt(this.value)];
    }

    getAddress(app: App){
        return parseInt(this.value);
    }
}

class Pointer extends ReferenceArgument {
    getCellValue(app: App){
        return app.memory[app.memory[parseInt(this.value)]];
    }

    getAddress(app: App){
        return app.memory[parseInt(this.value)];
    }
}

const ArgumentsTypes = {
    "address": Address,
    "integer": Integer, 
    "pointer": Pointer,
    "label": LabelArg
}


export {
    Argument,
    CellArgument,
    ReferenceArgument,
    LabelArg,
    Integer,
    Address,
    Pointer
};