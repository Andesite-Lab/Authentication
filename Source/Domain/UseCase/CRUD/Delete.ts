import { IWhereClauseDTO } from '@/Data/DTO';
import { CrudModel } from '@/Infrastructure/Repository/Model';

export class Delete<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;

    public constructor(tableName: string, databaseName: string) {
        this._tableName = tableName;
        this._databaseName = databaseName;
    }

    public execute(entitiesToUpdate: Partial<T>[] | Partial<Record<keyof T, IWhereClauseDTO>>[]): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName);
        return model.delete(entitiesToUpdate);
    }
}
