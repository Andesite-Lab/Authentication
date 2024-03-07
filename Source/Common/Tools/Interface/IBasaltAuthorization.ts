import { IRoleDTO, IPermissionDTO } from '@/Data/DTO/Model/StaticDB/authentication';

export interface IBasaltAuthorization {
    groupPermissionByRole(raw: Pick<IRoleDTO & IPermissionDTO, 'role' | 'permission'>[]): Record<string, string[]>;
    checkContainOneOfPermissions(permissionsToSearch: string[], entityToCheck: Record<string, string[]>): boolean;
    checkContainAllOfPermissions(permissionsToSearch: string[], entityToCheck: Record<string, string[]>): boolean;
}
