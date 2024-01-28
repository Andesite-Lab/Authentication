import { AbstractHandlerCrud } from '@/HTTP/Handler';
import { IPermissionDTO } from '@/Data/DTO/Models';
import { PermissionValidator } from '@/Validator';

export class AdminPermissionsHandler extends AbstractHandlerCrud<IPermissionDTO, PermissionValidator<IPermissionDTO>> {
    public constructor() {
        super({
            tableName: 'permission',
            keyInclusionFilter: ['permission', 'createdAt', 'updatedAt', 'id'],
            validator: PermissionValidator,
        });
    }
}
