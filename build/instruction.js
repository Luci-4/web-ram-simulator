"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructions = exports.Instruction = void 0;
var argument_1 = require("./argument");
var token_1 = require("./token");
var exceptions_1 = require("./exceptions");
var Instruction = /** @class */ (function (_super) {
    __extends(Instruction, _super);
    function Instruction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Instruction.prototype.validateAccumulatorDefinition = function (app) {
        if (typeof app.memory[0] === 'undefined') {
            var message = exceptions_1.UndefinedAccumulatorError.generateMessage(app.execHead);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    };
    Instruction.GenerateInstruction = function (text) {
        console.log("here: ", text);
        return new Instructions[text]();
    };
    Instruction.validateInstruction = function (text) {
        if (Instructions.hasOwnProperty(text)) {
            return true;
        }
        return false;
    };
    return Instruction;
}(token_1.Token));
exports.Instruction = Instruction;
var JumpInstr = /** @class */ (function (_super) {
    __extends(JumpInstr, _super);
    function JumpInstr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JumpInstr.prototype.validateArgument = function (argument) {
        if (argument instanceof argument_1.LabelArg) {
            return true;
        }
        return false;
    };
    JumpInstr.prototype.validateLabelsExistance = function (labelId, app) {
        if (!app.lexer.labelsWithIndices.hasOwnProperty(labelId)) {
            var message = exceptions_1.LabelNotFoundError.generateMessage(app.execHead, labelId);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    };
    return JumpInstr;
}(Instruction));
var OperationInst = /** @class */ (function (_super) {
    __extends(OperationInst, _super);
    function OperationInst() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationInst.prototype.validateArgument = function (argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (argument instanceof argument_1.CellArgument) {
            return true;
        }
        return false;
    };
    OperationInst.prototype.validateCellDefinition = function (argument, app) {
        if (typeof argument.getCellValue(app) === 'undefined') {
            var message = exceptions_1.UndefinedCellError.generateMessage(app.execHead);
            app.debugConsole.push(message);
            return false;
        }
        return true;
    };
    return OperationInst;
}(Instruction));
var Jump = /** @class */ (function (_super) {
    __extends(Jump, _super);
    function Jump() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jump.prototype.execute = function (argument, app) {
        if (!this.validateLabelsExistance(argument.value, app)) {
            return false;
        }
        app.execHead = argument.getLabelIndex(app);
        return true;
    };
    return Jump;
}(JumpInstr));
var Jgtz = /** @class */ (function (_super) {
    __extends(Jgtz, _super);
    function Jgtz() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jgtz.prototype.execute = function (argument, app) {
        if (!this.validateLabelsExistance(argument.value, app)) {
            return false;
        }
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        if (app.memory[0] > 0) {
            app.execHead = app.lexer.labelsWithIndices[argument.value];
        }
        return true;
    };
    return Jgtz;
}(JumpInstr));
var Jzero = /** @class */ (function (_super) {
    __extends(Jzero, _super);
    function Jzero() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jzero.prototype.execute = function (argument, app) {
        if (!this.validateLabelsExistance(argument.value, app)) {
            return false;
        }
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        if (app.memory[0] === 0) {
            app.execHead = app.lexer.labelsWithIndices[argument.value];
        }
        return true;
    };
    return Jzero;
}(JumpInstr));
var Read = /** @class */ (function (_super) {
    __extends(Read, _super);
    function Read() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Read.prototype.execute = function (argument, app) {
        if (!this.validateInputDefinition(argument, app)) {
            return false;
        }
        var address = argument.getAddress(app);
        app.memory[address] = app.inputs[app.inputHead];
        app.inputHead++;
        app.execHead++;
        return true;
    };
    Read.prototype.validateArgument = function (argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (argument instanceof argument_1.ReferenceArgument) {
            return true;
        }
        else {
            return false;
        }
    };
    Read.prototype.validateInputDefinition = function (argument, app) {
        if (typeof app.inputs[app.inputHead] === 'undefined') {
            return false;
        }
        else {
            return true;
        }
    };
    return Read;
}(OperationInst));
var Write = /** @class */ (function (_super) {
    __extends(Write, _super);
    function Write() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Write.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateCellDefinition.call(this, argument, app)) {
            return false;
        }
        app.outputs[app.outputHead] = argument.getCellValue(app);
        app.outputHead++;
        app.execHead++;
        return true;
    };
    return Write;
}(OperationInst));
var Load = /** @class */ (function (_super) {
    __extends(Load, _super);
    function Load() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Load.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateCellDefinition.call(this, argument, app)) {
            return false;
        }
        app.memory[0] = argument.getCellValue(app);
        ;
        app.execHead++;
        return true;
    };
    return Load;
}(OperationInst));
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Store.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        app.memory[argument.getAddress(app)] = app.memory[0];
        app.execHead++;
        return true;
    };
    Store.prototype.validateArgument = function (argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (argument instanceof argument_1.ReferenceArgument) {
            return true;
        }
        else {
            return false;
        }
    };
    return Store;
}(OperationInst));
var Add = /** @class */ (function (_super) {
    __extends(Add, _super);
    function Add() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Add.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        if (!_super.prototype.validateCellDefinition.call(this, argument, app)) {
            return false;
        }
        app.memory[0] += argument.getCellValue(app);
        app.execHead++;
        return true;
    };
    return Add;
}(OperationInst));
var Sub = /** @class */ (function (_super) {
    __extends(Sub, _super);
    function Sub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sub.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        if (!_super.prototype.validateCellDefinition.call(this, argument, app)) {
            return false;
        }
        app.memory[0] -= argument.getCellValue(app);
        app.execHead++;
        return true;
    };
    return Sub;
}(OperationInst));
var Mult = /** @class */ (function (_super) {
    __extends(Mult, _super);
    function Mult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mult.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        if (!_super.prototype.validateCellDefinition.call(this, argument, app)) {
            return false;
        }
        app.memory[0] *= argument.getCellValue(app);
        app.execHead++;
        return true;
    };
    return Mult;
}(OperationInst));
var Div = /** @class */ (function (_super) {
    __extends(Div, _super);
    function Div() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Div.prototype.execute = function (argument, app) {
        if (!_super.prototype.validateAccumulatorDefinition.call(this, app)) {
            return false;
        }
        if (!_super.prototype.validateCellDefinition.call(this, argument, app)) {
            return false;
        }
        app.memory[0] /= argument.getCellValue(app);
        app.execHead++;
        return true;
    };
    return Div;
}(OperationInst));
var Halt = /** @class */ (function (_super) {
    __extends(Halt, _super);
    function Halt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Halt.prototype.execute = function (argument, app) {
        app.execHead = app.lexer.programLength;
        return true;
    };
    Halt.prototype.validateArgument = function (argument) {
        /**
         * validation of instructions that perform operations on numbers from cells
         */
        if (typeof argument === 'undefined') {
            return true;
        }
        return false;
    };
    return Halt;
}(Instruction));
var Instructions = {
    "read": Read,
    "load": Load,
    "store": Store,
    "add": Add,
    "sub": Sub,
    "mult": Mult,
    "div": Div,
    "jump": Jump,
    "jgtz": Jgtz,
    "jzero": Jzero,
    "write": Write,
    "halt": Halt
};
exports.Instructions = Instructions;
//# sourceMappingURL=instruction.js.map