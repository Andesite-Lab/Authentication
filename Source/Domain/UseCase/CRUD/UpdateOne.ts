import { CrudModel } from '@/Infrastructure/Repository/Model';

export class UpdateOne<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;

    public constructor(tableName: string, databaseName: string) {
        this._tableName = tableName;
        this._databaseName = databaseName;
    }

    public execute(newEntity: T, entityToUpdate: T): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName);
        return model.update(newEntity, [entityToUpdate]);
    }
}
