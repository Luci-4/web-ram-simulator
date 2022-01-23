class Statement {
    constructor(index) {
        this.isValid = false;
        this.isPopulated = false;
        this.index = index;
    }
    populate(label, instruction, argument) {
        this.label = label;
        this.instruction = instruction;
        this.argument = argument;
        this.isPopulated = true;
    }
    execute(emulator) {
        if (typeof this.instruction === "undefined") {
            emulator.execHead++;
            return true;
        }
        return this.instruction.execute(this.argument, emulator);
    }
    validate(parser) {
        let status = true;
        const errors = [];
        const labelIds = parser.contents.map((statement) => statement.label.id);
        (([s, e]) => {
            status = s;
            errors.push(...e);
        })(this.label.validate(this.index, labelIds));
        (([s, e]) => {
            status = s;
            errors.push(...e);
        })(this.argument.validate(this.index));
        (([s, e]) => {
            status = s;
            errors.push(...e);
        })(this.instruction.validate(this.index, this.argument));
        this.isValid = status;
        return [status, errors];
    }
}
export { Statement };
//# sourceMappingURL=statement.js.map