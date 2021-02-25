"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement = void 0;
var Statement = /** @class */ (function () {
    function Statement(label, instruction, argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
    }
    Statement.prototype.execute = function (app) {
        return this.instruction.execute(this.argument, app);
    };
    return Statement;
}());
exports.Statement = Statement;
//# sourceMappingURL=statement.js.map