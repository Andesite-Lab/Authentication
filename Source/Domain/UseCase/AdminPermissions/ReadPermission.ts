import { PermissionModel } from '@/Infrastructure/Repository/Model';
import { IPermissionDTO } from '@/Data/DTO/Models';

export class ReadPermission {
    private readonly _permissionModel: PermissionModel = new PermissionModel();

    public async execute (id: number): Promise<IPermissionDTO | undefined> {
        return await this._permissionModel.findOne([{
            id
        }]);
    }
}
