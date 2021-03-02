class Statement {
    constructor(label, instruction, argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
    }
    execute(app) {
        if (typeof this.instruction === "undefined") {
            app.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, app);
    }
}
export { Statement };
//# sourceMappingURL=statement.js.map