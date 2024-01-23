import { RoleModel } from '@/Infrastructure/Repository/Model';
import { IRoleDTO } from '@/Data/DTO/Models';
import { IOptionFindDTO } from '@/Data/DTO';

export class ReadRoles {
    private readonly _roleModel: RoleModel = new RoleModel();

    public async execute (optionFindBody: Partial<IOptionFindDTO>): Promise<IRoleDTO[]> {
        return await this._roleModel.findAll({}, {
            limit: parseInt(optionFindBody.limit as string),
            offset: parseInt(optionFindBody.offset as string),
        });
    }
}
