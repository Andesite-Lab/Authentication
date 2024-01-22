import { RoleModel } from '@/Infrastructure/Repository/Model';
import { IRoleDTO } from '@/Data/DTO/Models';

export class ReadRole {
    private readonly _roleModel: RoleModel = new RoleModel();

    public async execute (id: number): Promise<IRoleDTO | undefined> {
        return await this._roleModel.findOne([{
            id
        }], {});
    }
}
