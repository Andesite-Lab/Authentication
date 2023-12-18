import { Knex } from 'knex';

import { PermissionModel, RoleModel, RolePermissionModel } from '@/Infrastructure/Repository/Model';
import { IRoleDTO, IPermissionDTO, IRolePermissionDTO } from '@/Data/DTO/Models';

interface IRolesPermissions {
  roles: string[];
  permissions: string[];
  rolePermission: {
    [key: string]: string[];
  };
}

const RolesPermissions: IRolesPermissions = {
    roles: [
        'admin',
        'user',
    ],
    permissions: [
        'admin',
        'me',
        'me.read',
        'me.update',
        'me.delete',
        'user',
        'user.read',
        'user.update',
        'user.delete',
        'permission',
        'permission.create',
        'permission.read',
        'permission.update',
        'permission.delete',
        'role',
        'role.create',
        'role.read',
        'role.update',
        'role.delete',
        'role_permission',
        'role_permission.create',
        'role_permission.read',
        'role_permission.update',
        'role_permission.delete'
    ],
    rolePermission: {
        admin: [
            'admin'
        ],
        user: [
            'me.read',
            'me.update',
            'me.delete',
        ],
    }
};

export class RoleAndPermission implements Knex.Seed {
    public async seed(knex: Knex): Promise<void> {
        try {
            await knex.transaction(async (trx): Promise<void> => {
                const roles: Partial<IRoleDTO>[] = [];
                for (let i = 0; i < RolesPermissions.roles.length; ++i)
                    roles.push({
                        role: RolesPermissions.roles[i] as string,
                    });

                const permissions: Partial<IPermissionDTO>[] = [];

                for (let i = 0; i < RolesPermissions.permissions.length; ++i)
                    permissions.push({
                        permission: RolesPermissions.permissions[i] as string,
                    });

                const roleModel: RoleModel = new RoleModel();
                const rolesGet: IRoleDTO[] = await roleModel.insert(roles, {},{ transaction: trx });

                const permissionModel: PermissionModel = new PermissionModel();
                const permissionsGet: IPermissionDTO[] = await permissionModel.insert(permissions, {}, { transaction: trx });

                const rolePermissionModel: RolePermissionModel = new RolePermissionModel();

                for (const role of roles)
                    if (RolesPermissions.rolePermission[role.role as string]) {
                        const rolePermission: Pick<IRolePermissionDTO, 'roleId' | 'permissionId'>[] = [];

                        for (const permission of RolesPermissions.rolePermission[role.role as string]!) {
                            const roleFind: IRoleDTO | undefined = rolesGet.find((m: IRoleDTO): boolean => m.role === role.role);
                            const permissionFind: IPermissionDTO | undefined = permissionsGet.find((m): boolean => m.permission === permission);
                            if (roleFind && permissionFind)
                                rolePermission.push({
                                    roleId: roleFind.id,
                                    permissionId: permissionFind.id,
                                });
                        }
                        await rolePermissionModel.insert(rolePermission, {}, { transaction: trx });
                    }
            });
        } catch (_) { /* empty */ }
    }
}
