import { CrudModel } from '@/Infrastructure/Repository/Model';
import { IPaginationOptionsDTO } from '@/Data/DTO';

export class Find<T extends NonNullable<unknown>> {
    private readonly _model: CrudModel<T>;

    public constructor(tableName: string) {
        this._model = new CrudModel(tableName);
    }

    public async execute(option: IPaginationOptionsDTO): Promise<T | undefined> {
        return await this._model.find([entity]);
    }
}
