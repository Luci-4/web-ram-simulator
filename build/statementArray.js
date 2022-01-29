import { PopulatedLabel } from "./label.js";
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
    generateLabelsMap() {
        // swap statements' indices with tokens labels' ids to create labelsWithIndices
        const labelsWithIndices = {};
        Object.keys(this._statements).forEach((key) => {
            if (typeof key !== 'undefined') {
                let index = parseInt(key);
                let statement = this._statements[index];
                let label = statement.label;
                if (label instanceof PopulatedLabel) {
                    let labelId = label.id;
                    labelsWithIndices[labelId] = index;
                }
            }
        });
        return labelsWithIndices;
    }
}
//# sourceMappingURL=statementArray.js.map