import { IPermissionDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { AbstractModel } from '@/Infrastructure/Repository/Model';

export class PermissionModel extends AbstractModel<IPermissionDTO>{
    public constructor() {
        super('permission', 'authentication');
    }
}
