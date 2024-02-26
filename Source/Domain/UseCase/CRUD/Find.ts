import { IPaginationOptionsDTO, IWhereClauseDTO } from '@/Data/DTO';
import { CrudModel } from '@/Infrastructure/Repository/Model';

export class Find<T extends NonNullable<unknown>> {
    private _tableName: string;
    private _databaseName: string;

    public constructor(tableName: string, databaseName: string) {
        this._tableName = tableName;
        this._databaseName = databaseName;
    }

    public execute(entities: Partial<T>[] | Partial<Record<keyof T, IWhereClauseDTO>>[], option: IPaginationOptionsDTO | undefined): Promise<T[]> {
        const model: CrudModel<T> = new CrudModel(this._tableName, this._databaseName);
        return model.find(entities, {}, option);
    }
}
