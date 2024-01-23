import { FastifyInstance } from 'fastify';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { AbstractRouter } from '@/HTTP/Router';
import { AdminRolesHandler } from '@/HTTP/Handler';
import { PermissionChecker, TokenChecker } from '@/HTTP/Middleware';

export class AdminRolesRouter extends AbstractRouter<AdminRolesHandler> {
    constructor(routerPrefix: string = '/') {
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

        fastify.route({
            method: 'GET',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.read'], false)],
            handler: this._handler.getRole,
            schema: {
                tags: ['Admin'],
                summary: 'Get a role',
                params: validationMetadatasToSchemas().IdParam
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.update'], false)],
            handler: this._handler.updateRole,
            schema: {
                tags: ['Admin'],
                summary: 'Update a role',
                params: validationMetadatasToSchemas().IdParam,
                body: validationMetadatasToSchemas().RoleBody
            },
            attachValidation: true
        });

    }
}
