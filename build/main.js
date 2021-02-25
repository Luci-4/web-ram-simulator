"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var lexer_1 = require("./lexer");
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.init = function (program, inputs) {
        var _this = this;
        this.memory = [];
        this.inputs = inputs;
        this.outputs = [];
        this.debugConsole = [];
        this.lexer = new lexer_1.Lexer(program);
        // check if all tokens could be generated properly
        var foundInvalidStatements = this.lexer.contents.some(function (element) { return typeof element === "undefined"; });
        if (foundInvalidStatements) {
            // load all messages from lexer's console
            this.lexer.debugConsole.forEach(function (message) {
                _this.debugConsole.push(message);
            });
            return false;
        }
        this.lexer.mapLabels();
        this.execHead = 0;
        this.inputHead = 0;
        this.outputHead = 0;
        return true;
    };
    App.prototype.run = function (program, inputs) {
        // check if there were errors during init
        if (!this.init(program, inputs)) {
            console.log(this.debugConsole);
            return 1;
        }
        while (this.execHead < this.lexer.programLength) {
            var currentStatement = this.lexer.contents[this.execHead];
            if (!currentStatement.execute(this)) {
                console.log(this.debugConsole);
                return 1;
            }
            console.log(this.memory);
            console.log(this.outputs);
        }
        return 0;
    };
    return App;
}());
exports.App = App;
var app = new App();
var program = "read 1\nread 2\nread 3\nload 1\nsub 2\nsub 3\nwrite 0\n";
var inputs = [2, 4, 3];
app.run(program, inputs);
// console.log(app.lexer.contents);
console.log(app.memory);
console.log(app.outputs);
console.log("CONSOLE:");
console.log(app.debugConsole);
// app.run(program, memory, inputs);
//# sourceMappingURL=main.js.map