export interface ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO {
    'credential_role.credentialUuid': string;
    'credential_role.roleId': number;
    'credential_role.id': number;
    'role': string;
    'role.createdAt': Date;
    'role.id': number;
    'role_permission.roleId': number;
    'role_permission.permissionId': number;
    'role_permission.id': number;
    'permission': string;
    'permission.createdAt': Date;
    'permission.id': number;
}
