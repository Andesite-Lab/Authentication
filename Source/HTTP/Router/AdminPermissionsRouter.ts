import { FastifyInstance } from 'fastify';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { AbstractRouter } from '@/HTTP/Router';
import { AdminPermissionsHandler } from '@/HTTP/Handler';
import { PermissionChecker, TokenChecker } from '@/HTTP/Middleware';

export class AdminPermissionsRouter extends AbstractRouter<AdminPermissionsHandler> {
    public constructor(routerPrefix: string = '/') {
        super(new AdminPermissionsHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'POST',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.create'], false)],
            handler: this._handler.createPermission,
            schema: {
                tags: ['Admin'],
                summary: 'Add a new permission',
                body: validationMetadatasToSchemas().PermissionValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.read'], false)],
            handler: this._handler.getPermissions,
            schema: {
                tags: ['Admin'],
                summary: 'Get all permissions'
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.read'], false)],
            handler: this._handler.getPermission,
            schema: {
                tags: ['Admin'],
                summary: 'Get a permission',
                params: validationMetadatasToSchemas().IdValidator
            },
            attachValidation: true
        });

    }
}
