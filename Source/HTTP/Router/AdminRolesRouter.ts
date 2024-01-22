import { FastifyInstance } from 'fastify';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { AbstractRouter } from '@/HTTP/Router';
import { AdminRolesHandler } from '@/HTTP/Handler';
import { PermissionChecker, TokenChecker } from '@/HTTP/Middleware';

export class AdminRolesRouter extends AbstractRouter<AdminRolesHandler> {
    constructor(routerPrefix: string = '/auth') {
        super(new AdminRolesHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'POST',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.create'], false)],
            handler: this._handler.createRole,
            schema: {
                tags: ['Admin'],
                summary: 'Add a new role',
                body: validationMetadatasToSchemas().RoleBody
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.read'], false)],
            handler: this._handler.getRoles,
            schema: {
                tags: ['Admin'],
                summary: 'Get all roles'
            },
            attachValidation: true
        });
    }
}
