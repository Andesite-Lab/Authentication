import { CrudModel } from '@/Infrastructure/Repository/Model';

export class Insert<T extends NonNullable<unknown>> {
    private readonly _model: CrudModel<T>;

    public constructor(tableName: string) {
        this._model = new CrudModel(tableName);
    }

    public async execute (entity: T | T[]): Promise<T[]> {
        return await this._model.insert([...(Array.isArray(entity) ? entity : [entity])]);
    }
}
