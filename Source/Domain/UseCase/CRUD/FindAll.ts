import { IPaginationOptionDTO } from '@/Data/DTO';
import { CrudModel } from '@/Infrastructure/Repository/Model';

export class FindAll<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;
    private _primaryKeyName: [keyof T, 'NUMBER' | 'STRING'];

    public constructor(tableName: string, databaseName: string, primaryKeyName: [keyof T, 'NUMBER' | 'STRING']) {
        this._tableName = tableName;
        this._databaseName = databaseName;
        this._primaryKeyName = primaryKeyName;
    }

    public execute(paginationOptions: Partial<IPaginationOptionDTO> | undefined): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName, this._primaryKeyName);
        return model.findAll({}, {
            limit: paginationOptions?.limit ? paginationOptions.limit : undefined,
            offset: paginationOptions?.offset ? paginationOptions.offset : undefined,
        });
    }
}
