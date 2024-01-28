import { ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO } from '@/Data/DTO/Models/Fk';

export interface IBasaltAuthorization {
    groupPermissionByRole(raw: Pick<ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO, 'role' | 'permission'>[]): Record<string, string[]>;
    checkContainOneOfPermissions(permissionsToSearch: string[], entityToCheck: Record<string, string[]>): boolean;
    checkContainAllOfPermissions(permissionsToSearch: string[], entityToCheck: Record<string, string[]>): boolean;
}
