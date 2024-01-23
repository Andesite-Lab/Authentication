import { RoleModel } from '@/Infrastructure/Repository/Model';

export class CreateRole {
    private readonly _roleModel: RoleModel = new RoleModel();

    public async execute (role: string): Promise<void> {
        await this._roleModel.insert([{
            role
        }]);
    }
}
