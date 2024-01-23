import { PermissionModel } from '@/Infrastructure/Repository/Model';

export class CreatePermission {
    private readonly _permissionModel: PermissionModel = new PermissionModel();

    public async execute (permission: string): Promise<void> {
        await this._permissionModel.insert([{
            permission
        }], {});
    }
}
