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
exports.Pointer = exports.Address = exports.Integer = exports.LabelArg = exports.ReferenceArgument = exports.CellArgument = exports.Argument = void 0;
var token_1 = require("./token");
var Argument = /** @class */ (function (_super) {
    __extends(Argument, _super);
    function Argument(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    Argument.prototype.validateValue = function () {
        if (/^[0-9]+$/.test(this.value)) {
            return true;
        }
        return false;
    };
    Argument.GenerateArgument = function (text) {
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
    };
    return Argument;
}(token_1.Token));
exports.Argument = Argument;
var CellArgument = /** @class */ (function (_super) {
    __extends(CellArgument, _super);
    function CellArgument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CellArgument;
}(Argument));
exports.CellArgument = CellArgument;
var ReferenceArgument = /** @class */ (function (_super) {
    __extends(ReferenceArgument, _super);
    function ReferenceArgument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ReferenceArgument;
}(CellArgument));
exports.ReferenceArgument = ReferenceArgument;
var LabelArg = /** @class */ (function (_super) {
    __extends(LabelArg, _super);
    function LabelArg() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelArg.prototype.validateValue = function () {
        if (this.value) {
            return true;
        }
        return false;
    };
    LabelArg.prototype.getLabelIndex = function (app) {
        return app.lexer.labelsWithIndices[this.value];
    };
    return LabelArg;
}(Argument));
exports.LabelArg = LabelArg;
var Integer = /** @class */ (function (_super) {
    __extends(Integer, _super);
    function Integer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Integer.prototype.getCellValue = function (app) {
        return parseInt(this.value);
    };
    return Integer;
}(CellArgument));
exports.Integer = Integer;
var Address = /** @class */ (function (_super) {
    __extends(Address, _super);
    function Address() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Address.prototype.getCellValue = function (app) {
        return app.memory[parseInt(this.value)];
    };
    Address.prototype.getAddress = function (app) {
        return parseInt(this.value);
    };
    return Address;
}(ReferenceArgument));
exports.Address = Address;
var Pointer = /** @class */ (function (_super) {
    __extends(Pointer, _super);
    function Pointer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pointer.prototype.getCellValue = function (app) {
        return app.memory[app.memory[parseInt(this.value)]];
    };
    Pointer.prototype.getAddress = function (app) {
        return app.memory[parseInt(this.value)];
    };
    return Pointer;
}(ReferenceArgument));
exports.Pointer = Pointer;
var ArgumentsTypes = {
    "address": Address,
    "integer": Integer,
    "pointer": Pointer,
    "label": LabelArg
};
//# sourceMappingURL=argument.js.map