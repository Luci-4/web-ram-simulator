import { Token } from "./token.js";
import { InvalidArgumentValueError } from "./exceptions.js";
class Argument extends Token {
    constructor(value) {
        super();
        this.value = value;
    }
    static Generate(text) {
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
    parseValidate(lineIndex) {
        const errors = [];
        let status = true;
        if (!this.validateValue()) {
            errors.push(new InvalidArgumentValueError(lineIndex, this));
            status = false;
        }
        return [status, errors];
    }
}
class NullArgument extends Argument {
    constructor(value = undefined) {
        super(value);
        this.value = value;
    }
    validateValue() {
        return (typeof this.value === "undefined");
    }
}
class PopulatedArgument extends Argument {
    validateValue() {
        let valueLengthIsZero = this.value.length === 0;
        let valueIsNaN = isNaN(Number(this.value));
        return !(valueLengthIsZero || valueIsNaN);
    }
}
class CellArgument extends PopulatedArgument {
}
class ReferenceArgument extends CellArgument {
}
class LabelArg extends PopulatedArgument {
    validateValue() {
        return (this.value.length > 0);
    }
    getLabelIndex(labelsWithIndices) {
        return labelsWithIndices[this.value];
    }
}
class Integer extends CellArgument {
    getCellValue(memory) {
        return parseInt(this.value);
    }
}
class Address extends ReferenceArgument {
    getCellValue(memory) {
        return memory[parseInt(this.value)];
    }
    getAddress(memory) {
        return parseInt(this.value);
    }
}
class Pointer extends ReferenceArgument {
    getCellValue(memory) {
        return memory[memory[parseInt(this.value)]];
    }
    getAddress(memory) {
        return memory[parseInt(this.value)];
    }
}
const ArgumentsTypes = {
    "null": NullArgument,
    "address": Address,
    "integer": Integer,
    "pointer": Pointer,
    "label": LabelArg
};
export { Argument, PopulatedArgument, NullArgument, CellArgument, ReferenceArgument, LabelArg, Integer, Address, Pointer };
//# sourceMappingURL=argument.js.map