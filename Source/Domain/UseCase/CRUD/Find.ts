import { IPaginationOptionDTO, IWhereClauseDTO } from '@/Data/DTO';
import { CrudModel } from '@/Infrastructure/Repository/Model';

export class Find<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;
    private _primaryKeyName: [keyof T, 'NUMBER' | 'STRING'];

    public constructor(tableName: string, databaseName: string, primaryKeyName: [keyof T, 'NUMBER' | 'STRING']) {
        this._tableName = tableName;
        this._databaseName = databaseName;
        this._primaryKeyName = primaryKeyName;
    }

    public execute(entities: Partial<T>[] | Partial<Record<keyof T, IWhereClauseDTO>>[], option: IPaginationOptionDTO | undefined): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName, this._primaryKeyName);
        return model.find(entities, {}, option);
    }
}
