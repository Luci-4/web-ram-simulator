import { PopulatedLabel } from "./label";
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

}