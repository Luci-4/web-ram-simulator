"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement = void 0;
class Statement {
    constructor(label, instruction, argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
    }
    execute(app) {
        return this.instruction.execute(this.argument, app);
    }
}
exports.Statement = Statement;
//# sourceMappingURL=statement.js.map