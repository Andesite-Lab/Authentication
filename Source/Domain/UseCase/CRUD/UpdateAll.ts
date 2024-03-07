import { CrudModel } from '@/Infrastructure/Repository/Model';

export class UpdateAll<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;

    public constructor(tableName: string, databaseName: string) {
        this._tableName = tableName;
        this._databaseName = databaseName;
    }

    public execute(newEntity: T): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName);
        return model.updateAll(newEntity);
    }
}
