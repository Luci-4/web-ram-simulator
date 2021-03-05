import { Token } from "./token.js";
class Argument extends Token {
    constructor(value) {
        super();
        this.value = value;
    }
    validateValue() {
        if (this.value.length === 0 || isNaN(Number(this.value))) {
            return false;
        }
        return true;
    }
    static GenerateArgument(text) {
        if (/^[0-9]+$/.test(text)) {
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
}
class CellArgument extends Argument {
}
class ReferenceArgument extends CellArgument {
}
class LabelArg extends Argument {
    validateValue() {
        if (this.value.length > 0) {
            return true;
        }
        return false;
    }
    getLabelIndex(parser) {
        return parser.lexer.labelsWithIndices[this.value];
    }
}
class Integer extends CellArgument {
    getCellValue(parser) {
        return parseInt(this.value);
    }
}
class Address extends ReferenceArgument {
    getCellValue(parser) {
        return parser.memory[parseInt(this.value)];
    }
    getAddress(parser) {
        return parseInt(this.value);
    }
}
class Pointer extends ReferenceArgument {
    getCellValue(parser) {
        return parser.memory[parser.memory[parseInt(this.value)]];
    }
    getAddress(parser) {
        return parser.memory[parseInt(this.value)];
    }
}
const ArgumentsTypes = {
    "address": Address,
    "integer": Integer,
    "pointer": Pointer,
    "label": LabelArg
};
export { Argument, CellArgument, ReferenceArgument, LabelArg, Integer, Address, Pointer };
//# sourceMappingURL=argument.js.map