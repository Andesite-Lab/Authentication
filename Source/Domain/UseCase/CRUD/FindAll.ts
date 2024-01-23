import { CrudModel } from '@/Infrastructure/Repository/Model';
import { IPaginationOptionsDTO } from '@/Data/DTO';

export class FindAll<T extends NonNullable<unknown>> {
    private readonly _model: CrudModel<T>;

    public constructor(tableName: string) {
        this._model = new CrudModel(tableName);
    }

    public async execute(paginationOptions: Partial<IPaginationOptionsDTO>): Promise<T[]> {
        return await this._model.findAll({}, {
            limit: paginationOptions.limit ? parseInt(paginationOptions.limit) : undefined,
            offset: paginationOptions.offset ? parseInt(paginationOptions.offset) : undefined,
        });
    }
}
