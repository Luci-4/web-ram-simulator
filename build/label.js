"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
const token_1 = require("./token");
class Label extends token_1.Token {
    constructor(text) {
        super();
        this.id = text;
    }
}
exports.Label = Label;
//# sourceMappingURL=label.js.map