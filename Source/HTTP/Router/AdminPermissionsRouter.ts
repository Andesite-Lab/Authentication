import { AbstractCrudRouter } from '@/HTTP/Router';
import { IPermissionDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { PermissionSchema } from '@/Schema';

export class AdminPermissionsRouter extends AbstractCrudRouter<IPermissionDTO> {
    public constructor(routerPrefix: string) {
        super({
            databaseName: 'authentication',
            tableName: 'permission',
            schema: PermissionSchema,
            routerPrefix,
            tags: 'Admin-Permission',
            primaryKeyName: ['id', 'NUMBER'],
            crudOperationWithPermission: {
                insert: ['admin', 'permission.all', 'permission.create'],
                findAll: ['admin', 'permission.all', 'permission.read'],
                findOne: ['admin', 'permission.all', 'permission.read'],
                updateAll: ['admin', 'permission.all', 'permission.update'],
                updateOne: ['admin', 'permission.all', 'permission.update'],
                deleteAll: ['admin', 'permission.all', 'permission.delete'],
                deleteOne: ['admin', 'permission.all', 'permission.delete'],
                truncate: ['admin', 'permission.all', 'permission.delete']
            }
        });
    }
}
