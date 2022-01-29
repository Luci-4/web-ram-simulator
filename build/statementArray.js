export default class StatementArray {
    constructor() {
        this._statements = [];
    }
    get statements() {
        return this._statements;
    }
    get length() {
        return this.statements.length;
    }
    getByIndex(index) {
        return this.statements[index];
    }
    add(statement) {
        this.statements.push(statement);
    }
    getLabelIds() {
        return this.statements.map((statement) => statement.label.id);
    }
}
//# sourceMappingURL=statementArray.js.map