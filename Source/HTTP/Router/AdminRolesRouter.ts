import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { FastifyInstance } from 'fastify';

import { AdminRolesHandler } from '@/HTTP/Handler';
import { BlacklistedChecker, PermissionChecker, TokenChecker } from '@/HTTP/Middleware';
import { AbstractRouter } from '@/HTTP/Router';

export class AdminRolesRouter extends AbstractRouter<AdminRolesHandler> {
    public constructor(routerPrefix: string = '/') {
        super(new AdminRolesHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'POST',
            url: '/',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.create'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.insert   ,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Insert one role or many roles',
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/all',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.read'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.findAll,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Find all roles'
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/:id',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.read'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.findOneById,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Find one role',
                params: validationMetadatasToSchemas().IdValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.read'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.find,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Find by clause role',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/all',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.update'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.updateAll,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Update all roles',
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/:id',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.update'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.updateOneById,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Update one role',
                params: validationMetadatasToSchemas().IdValidator,
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.delete'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.update,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Update by clause role',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/all',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.delete'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.deleteAll,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Delete all roles',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/:id',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.delete'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.deleteOneById,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Delete one role',
                params: validationMetadatasToSchemas().IdValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.delete'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.delete,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Delete by clause role',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/truncate',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.delete'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.truncate,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Truncate role',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/count',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'role', 'role.read'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.count,
            schema: {
                tags: ['Admin-Role'],
                summary: 'Count role',
            },
            attachValidation: true
        });

    }
}
