import { AbstractModel } from './AbstractModel';
import { IPermissionDTO } from '@/Data/DTO/Models';

export class PermissionModel extends AbstractModel<IPermissionDTO>{
    public constructor() {
        super('permission');
    }
}
