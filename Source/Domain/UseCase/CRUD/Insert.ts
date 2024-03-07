import { CrudModel } from '@/Infrastructure/Repository/Model';

export class Insert<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;

    public constructor(tableName: string, databaseName: string) {
        this._tableName = tableName;
        this._databaseName = databaseName;
    }

    public execute (entity: T | T[]): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName);
        return model.insert([...(Array.isArray(entity) ? entity : [entity])]);
    }
}
