import { CrudModel } from '@/Infrastructure/Repository/Model';

export class FindOne<T extends NonNullable<unknown>> {
    private readonly _model: CrudModel<T>;

    public constructor(tableName: string) {
        this._model = new CrudModel(tableName);
    }

    public async execute(entity: T): Promise<T | undefined> {
        return await this._model.findOne([entity]);
    }
}
