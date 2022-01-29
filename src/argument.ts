import {Emulator} from "./emulator.js";
import {Token} from "./token.js";
import { Error_, InvalidArgumentValueError } from "./exceptions.js";

abstract class Argument extends Token{
    value: string | undefined;

    constructor(value: string | undefined) {
        super();
        this.value = value;
    }

    protected abstract validateValue(): boolean;

    public static Generate(text: string | undefined): Argument {
        if (typeof text === "undefined") {
            return new ArgumentsTypes["null"](text);
        }
        else if (/^[0-9]+$/.test(text)) {
            return new ArgumentsTypes["address"](text);
        }
    
        else if (text[0] === "=") {
            return new ArgumentsTypes["integer"](text.slice(1));
        }
    
        else if (text[0] === "^") {
            return new ArgumentsTypes["pointer"](text.slice(1));
        }
    
        else {
            return new ArgumentsTypes["label"](text);
        }
    }

    parseValidate(lineIndex: number): [boolean, Error_[]] {
        const errors: Error_[] = []
        let status = true;

        if (!this.validateValue()) {
            errors.push(new InvalidArgumentValueError(lineIndex, this))
            status = false
        }
        
        return [status, errors]
    }
}

class NullArgument extends Argument {
    value: undefined; 

    constructor(value: undefined = undefined) {
        super(value);
        this.value = value;
    }

    protected validateValue() {
        return (typeof this.value === "undefined");
    }
}

abstract class PopulatedArgument extends Argument {
    value: string;

    protected validateValue() {
        let valueLengthIsZero = this.value.length === 0;
        let valueIsNaN = isNaN(Number(this.value));
        return !(valueLengthIsZero || valueIsNaN);
    }
}

abstract class CellArgument extends PopulatedArgument {
    abstract getCellValue(memory: number[]): number;
}

abstract class ReferenceArgument extends CellArgument {
    abstract getAddress(memory: number[]): number;
}

class LabelArg extends PopulatedArgument {
    value: string;

    protected validateValue() {
        return (this.value.length > 0);
    }

    getLabelIndex(labelsWithIndices: {[key: string]: number}) {
        return labelsWithIndices[this.value];
    }
}

class Integer extends CellArgument {
    getCellValue(memory: number[]) {
        return parseInt(this.value);
    }
}

class Address extends ReferenceArgument {
    getCellValue(memory: number[]) {
        return memory[parseInt(this.value)];
    }

    getAddress(memory: number[]) {
        return parseInt(this.value);
    }
}

class Pointer extends ReferenceArgument {
    getCellValue(memory: number[]) {
        return memory[memory[parseInt(this.value)]];
    }

    getAddress(memory: number[]) {
        return memory[parseInt(this.value)];
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