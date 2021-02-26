"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelNotFoundError = exports.EmptyArgumentError = exports.InvalidArgumentValueError = exports.InvalidArgumentError = exports.UndefinedCellError = exports.UndefinedAccumulatorError = exports.InvalidInstructionError = exports.UnexpectedTokenError = exports.DuplicateLabelsError = void 0;
var DuplicateLabelsError = /** @class */ (function () {
    function DuplicateLabelsError() {
    }
    DuplicateLabelsError.generateMessage = function (lineIndex, label) {
        return "DuplicateLabelsError:in line " + lineIndex + " label " + label.id + " already exists\n";
    };
    return DuplicateLabelsError;
}());
exports.DuplicateLabelsError = DuplicateLabelsError;
var UnexpectedTokenError = /** @class */ (function () {
    function UnexpectedTokenError() {
    }
    UnexpectedTokenError.generateMessage = function (lineIndex, count) {
        return "UnexpectedTokenError: in line " + lineIndex + " expected 3 tokens, got " + count + "\n";
    };
    return UnexpectedTokenError;
}());
exports.UnexpectedTokenError = UnexpectedTokenError;
var InvalidInstructionError = /** @class */ (function () {
    function InvalidInstructionError() {
    }
    InvalidInstructionError.generateMessage = function (lineIndex, text) {
        return "InvalidInstructionError: in line " + lineIndex + " '" + text + "'\n";
    };
    return InvalidInstructionError;
}());
exports.InvalidInstructionError = InvalidInstructionError;
var InvalidArgumentError = /** @class */ (function () {
    function InvalidArgumentError() {
    }
    InvalidArgumentError.generateMessage = function (lineIndex, argument, instruction) {
        return "InvalidArgumentError: in line " + lineIndex + " invalid argument of type " + argument.constructor.name + " for " + instruction.constructor.name + "\n";
    };
    return InvalidArgumentError;
}());
exports.InvalidArgumentError = InvalidArgumentError;
var InvalidArgumentValueError = /** @class */ (function () {
    function InvalidArgumentValueError() {
    }
    InvalidArgumentValueError.generateMessage = function (lineIndex, argument) {
        return "InvalidArgumentValueError: in line " + lineIndex + " unexpected value '" + argument.value + "' for argument of type " + argument.constructor.name + "\n";
    };
    return InvalidArgumentValueError;
}());
exports.InvalidArgumentValueError = InvalidArgumentValueError;
var EmptyArgumentError = /** @class */ (function () {
    function EmptyArgumentError() {
    }
    EmptyArgumentError.generateMessage = function (lineIndex, instruction) {
        return "EmptyArgumentError: in line " + lineIndex + " instruction " + instruction.constructor.name + " expects an argument\n";
    };
    return EmptyArgumentError;
}());
exports.EmptyArgumentError = EmptyArgumentError;
var UndefinedAccumulatorError = /** @class */ (function () {
    function UndefinedAccumulatorError() {
    }
    UndefinedAccumulatorError.generateMessage = function (lineIndex) {
        return "UndefinedAccumulatorError: in line " + lineIndex + "\n";
    };
    return UndefinedAccumulatorError;
}());
exports.UndefinedAccumulatorError = UndefinedAccumulatorError;
var UndefinedCellError = /** @class */ (function () {
    function UndefinedCellError() {
    }
    UndefinedCellError.generateMessage = function (lineIndex) {
        return "UndefinedCellError: in line " + lineIndex + "\n";
    };
    return UndefinedCellError;
}());
exports.UndefinedCellError = UndefinedCellError;
var LabelNotFoundError = /** @class */ (function () {
    function LabelNotFoundError() {
    }
    LabelNotFoundError.generateMessage = function (lineIndex, labelId) {
        return "LabelNotFoundError: in line " + lineIndex + " label " + labelId + " doesn't exist\n";
    };
    return LabelNotFoundError;
}());
exports.LabelNotFoundError = LabelNotFoundError;
//# sourceMappingURL=exceptions.js.map