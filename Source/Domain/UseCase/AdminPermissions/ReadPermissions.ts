import { PermissionModel } from '@/Infrastructure/Repository/Model';
import { IPermissionDTO } from '@/Data/DTO/Models';
import { IOptionFindDTO } from '@/Data/DTO';

export class ReadPermissions {
    private readonly _permissionModel: PermissionModel = new PermissionModel();

    public async execute (optionFindBody: Partial<IOptionFindDTO>): Promise<IPermissionDTO[]> {
        return await this._permissionModel.findAll({}, {
            limit: parseInt(optionFindBody.limit as string),
            offset: parseInt(optionFindBody.offset as string),
        });
    }
}
