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
    validate(lineIndex) {
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
    validateValue() {
        if (typeof this.value === "undefined") {
            return true;
        }
        return false;
    }
}
class PopulatedArgument extends Argument {
    validateValue() {
        if (this.value.length === 0 || isNaN(Number(this.value))) {
            return false;
        }
        return true;
    }
}
class CellArgument extends PopulatedArgument {
}
class ReferenceArgument extends CellArgument {
}
class LabelArg extends PopulatedArgument {
    validateValue() {
        if (this.value.length > 0) {
            return true;
        }
        return false;
    }
    getLabelIndex(emulator) {
        return emulator.parser.labelsWithIndices[this.value];
    }
}
class Integer extends CellArgument {
    getCellValue(emulator) {
        return parseInt(this.value);
    }
}
class Address extends ReferenceArgument {
    getCellValue(emulator) {
        return emulator.memory[parseInt(this.value)];
    }
    getAddress(emulator) {
        return parseInt(this.value);
    }
}
class Pointer extends ReferenceArgument {
    getCellValue(emulator) {
        return emulator.memory[emulator.memory[parseInt(this.value)]];
    }
    getAddress(emulator) {
        return emulator.memory[parseInt(this.value)];
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