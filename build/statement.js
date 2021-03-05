class Statement {
    constructor(label, instruction, argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
    }
    execute(parser) {
        if (typeof this.instruction === "undefined") {
            parser.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, parser);
    }
}
export { Statement };
//# sourceMappingURL=statement.js.map