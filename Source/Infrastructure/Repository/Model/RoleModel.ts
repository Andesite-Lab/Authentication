import { AbstractModel } from '@/Infrastructure/Repository/Model';
import { IRoleDTO } from '@/Data/DTO/Models';

export class RoleModel extends AbstractModel<IRoleDTO>{
    constructor() {
        super('role');
    }
}
