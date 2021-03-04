import { Token } from "./token.js";
class Argument extends Token {
    constructor(value) {
        super();
        this.value = value;
    }
    validateValue() {
        if (isNaN(Number(this.value))) {
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
        if (this.value) {
            return true;
        }
        return false;
    }
    getLabelIndex(app) {
        return app.lexer.labelsWithIndices[this.value];
    }
}
class Integer extends CellArgument {
    getCellValue(app) {
        return parseInt(this.value);
    }
}
class Address extends ReferenceArgument {
    getCellValue(app) {
        return app.memory[parseInt(this.value)];
    }
    getAddress(app) {
        return parseInt(this.value);
    }
}
class Pointer extends ReferenceArgument {
    getCellValue(app) {
        return app.memory[app.memory[parseInt(this.value)]];
    }
    getAddress(app) {
        return app.memory[parseInt(this.value)];
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