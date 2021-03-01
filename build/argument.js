"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pointer = exports.Address = exports.Integer = exports.LabelArg = exports.ReferenceArgument = exports.CellArgument = exports.Argument = void 0;
const token_1 = require("./token");
class Argument extends token_1.Token {
    constructor(value) {
        super();
        this.value = value;
    }
    validateValue() {
        if (/^[0-9]+$/.test(this.value)) {
            return true;
        }
        return false;
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
exports.Argument = Argument;
class CellArgument extends Argument {
}
exports.CellArgument = CellArgument;
class ReferenceArgument extends CellArgument {
}
exports.ReferenceArgument = ReferenceArgument;
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
exports.LabelArg = LabelArg;
class Integer extends CellArgument {
    getCellValue(app) {
        return parseInt(this.value);
    }
}
exports.Integer = Integer;
class Address extends ReferenceArgument {
    getCellValue(app) {
        return app.memory[parseInt(this.value)];
    }
    getAddress(app) {
        return parseInt(this.value);
    }
}
exports.Address = Address;
class Pointer extends ReferenceArgument {
    getCellValue(app) {
        return app.memory[app.memory[parseInt(this.value)]];
    }
    getAddress(app) {
        return app.memory[parseInt(this.value)];
    }
}
exports.Pointer = Pointer;
const ArgumentsTypes = {
    "address": Address,
    "integer": Integer,
    "pointer": Pointer,
    "label": LabelArg
};
//# sourceMappingURL=argument.js.map