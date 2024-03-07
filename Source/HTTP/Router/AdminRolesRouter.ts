import { AbstractCrudRouter } from '@/HTTP/Router';
import { IRoleDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { RoleSchema } from '@/Schema';

export class AdminRolesRouter extends AbstractCrudRouter<IRoleDTO> {
    public constructor(routerPrefix: string) {
        super({
            databaseName: 'authentication',
            tableName: 'role',
            schema: RoleSchema,
            routerPrefix,
            tags: 'Admin-Roles',
            primaryKeyName: ['id', 'NUMBER'],
            crudOperationWithPermission: {
                insert: ['admin', 'role', 'role.create'],
                findAll: ['admin', 'role', 'role.read'],
                findOne: ['admin', 'role', 'role.read'],
                updateAll: ['admin', 'role', 'role.update'],
                updateOne: ['admin', 'role', 'role.update'],
                deleteAll: ['admin', 'role', 'role.delete'],
                deleteOne: ['admin', 'role', 'role.delete'],
                truncate: ['admin', 'role', 'role.delete']
            }
        });
    }
}
