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
                insert: ['admin', 'role.all', 'role.create'],
                findAll: ['admin', 'role.all', 'role.read'],
                findOne: ['admin', 'role.all', 'role.read'],
                updateAll: ['admin', 'role.all', 'role.update'],
                updateOne: ['admin', 'role.all', 'role.update'],
                deleteAll: ['admin', 'role.all', 'role.delete'],
                deleteOne: ['admin', 'role.all', 'role.delete'],
                truncate: ['admin', 'role.all', 'role.delete']
            }
        });
    }
}
