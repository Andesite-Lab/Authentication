import { CrudModel } from '@/Infrastructure/Repository/Model';

export class UpdateOne<T extends NonNullable<unknown>> {
    private readonly _model: CrudModel<T>;

    public constructor(tableName: string) {
        this._model = new CrudModel(tableName);
    }

    public async execute(newEntity: T, entityToUpdate: T): Promise<T[]> {
        return await this._model.update(newEntity, [entityToUpdate]);
    }
}
