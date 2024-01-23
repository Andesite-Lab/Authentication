import { AbstractHandlerCrud } from '@/HTTP/Handler';
import { IRoleDTO } from '@/Data/DTO/Models';
import { RoleValidator } from '@/Validator';

export class AdminRolesHandler extends AbstractHandlerCrud<IRoleDTO, RoleValidator<IRoleDTO>> {
    public constructor() {
        super({
            tableName: 'role',
            keyInclusionFilter: ['role'],
            validator: RoleValidator,
        });
    }
}
