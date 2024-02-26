import { IPaginationOptionsDTO } from '@/Data/DTO';
import { CrudModel } from '@/Infrastructure/Repository/Model';

export class FindAll<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;

    public constructor(tableName: string, databaseName: string) {
        this._tableName = tableName;
        this._databaseName = databaseName;
    }

    public execute(paginationOptions: Partial<IPaginationOptionsDTO> | undefined): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName);
        return model.findAll({}, {
            limit: paginationOptions?.limit ? paginationOptions.limit : undefined,
            offset: paginationOptions?.offset ? paginationOptions.offset : undefined,
        });
    }
}
