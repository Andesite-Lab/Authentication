import { IRoleDTO } from '@/Data/DTO/Models';
import { AbstractModel } from '@/Infrastructure/Repository/Model';

export class RoleModel extends AbstractModel<IRoleDTO>{
    public constructor() {
        super('role', 'authentication');
    }
}
