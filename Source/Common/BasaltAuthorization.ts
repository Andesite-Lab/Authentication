import { Knex } from 'knex';

import { IBasaltAuthorization } from '@/Common/Interface';
import { ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO } from '@/Data/DTO/Models/Fk';

export class BasaltAuthorization implements IBasaltAuthorization {
    private readonly _database: Knex | undefined;
    private static _instance: BasaltAuthorization;

    public static get instance(): BasaltAuthorization {
        if (!BasaltAuthorization._instance)
            BasaltAuthorization._instance = new BasaltAuthorization();
        return BasaltAuthorization._instance;
    }

    public groupPermissionByRole(raw: Pick<ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO, 'role' | 'permission'>[]): Record<string, string[]> {
        const roles: Record<string, string[]> = {};
        raw.forEach((row: Pick<ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO, 'role' | 'permission'>): void => {
            if (!row.role || !row.permission)
                throw new Error('Invalid data structure required role and permission');
            if (!roles[row.role])
                roles[row.role] = [];
            roles[row.role].push(row.permission);
        });
        return roles;
    }

    public checkContainOneOfPermissions(permissionsToSearch: string[], entityToCheck: Record<string, Set<string>>): boolean {
        return permissionsToSearch.some((permission: string) => {
            return Object.values(entityToCheck).some((permissions: Set<string>) => permissions.has(permission));
        });
    }

    public checkContainAllOfPermissions(permissionsToSearch: string[], entityToCheck: Record<string, Set<string>>): boolean {
        return permissionsToSearch.every((permission: string) => {
            return Object.values(entityToCheck).some((permissions: Set<string>) => permissions.has(permission));
        });
    }
}
