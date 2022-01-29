import { PopulatedLabel } from "./label.js";
import Statement from "./statement";

export default class StatementArray {
    private readonly _statements: Array<Statement> = [];

    public get statements(): Array<Statement> {
        return this._statements;
    }

    public get length(): number {
        return this.statements.length;
    }

    public getByIndex(index: number): Statement {
        return this.statements[index];
    }

    public add(statement: Statement): void {
        this.statements.push(statement);
    }

    public getLabelIds(): Array<string | undefined> {
        return this.statements.map((statement: Statement) => statement.label.id);
    }

    public generateLabelsMap(): {[key: string]: number} {
        // swap statements' indices with tokens labels' ids to create labelsWithIndices
        const labelsWithIndices: {[key: string]: number} = {};

        Object.keys(this._statements).forEach((key: string) => {
            if (typeof key !== 'undefined') {
                let index: number = parseInt(key);
                let statement = this._statements[index];
                let label = statement.label;

                if (label instanceof PopulatedLabel) {
                    let labelId = label.id;
                    labelsWithIndices[labelId] = index;
                }
            }
        })
        return labelsWithIndices
    }    

}