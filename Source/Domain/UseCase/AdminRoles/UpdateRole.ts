import { RoleModel } from '@/Infrastructure/Repository/Model';

export class UpdateRole {
    private readonly _roleModel: RoleModel = new RoleModel();

    public async execute (role: string, id: number): Promise<void> {
        await this._roleModel.update({
            role
        },[{
            id
        }]);
    }
}
