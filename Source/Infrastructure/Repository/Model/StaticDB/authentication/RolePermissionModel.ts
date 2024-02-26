import { ErrorInfrastructure, ErrorInfrastructureKey } from '@/Common/Error';
import { IRolePermissionDTO } from '@/Data/DTO/Models';
import { ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO } from '@/Data/DTO/Models/Fk';
import { AbstractModel } from '@/Infrastructure/Repository/Model';

export class RolePermissionModel extends AbstractModel<IRolePermissionDTO>{
    public constructor() {
        super('role_permission', 'authentication');
    }

    public async findAllJoinRoleAndPermissionByCredential(
        credentialUuid: string,
        columnToSelect: Partial<Record<keyof (ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO), boolean | string>>,
        options?: {
            toThrow?: boolean;
        }): Promise<ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO[]> {
        try {
            const result = await this._knex
                .select(this.transformColumnsToArray(columnToSelect))
                .join('role', 'role_permission.roleId', 'role.id')
                .join('permission', 'role_permission.permissionId', 'permission.id')
                .join('credential_role', 'role.id', 'credential_role.roleId')
                .from(this._tableName)
                .where('credential_role.credentialUuid', credentialUuid);

            if (!result)
                throw new ErrorInfrastructure({
                    key: ErrorInfrastructureKey.DATABASE_MODEL_NOT_FOUND,
                });
            return result;
        } catch (err) {
            if (options?.toThrow ?? true)
                this.forwardException(err);
            return [];
        }
    }
}
