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
            handler: this._handler.insert   ,
            schema: {
                tags: ['Admin'],
                summary: 'Insert one permission or many permissions',
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/all',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.read'], false)],
            handler: this._handler.findAll,
            schema: {
                tags: ['Admin'],
                summary: 'Find all permissions'
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.read'], false)],
            handler: this._handler.findOneById,
            schema: {
                tags: ['Admin'],
                summary: 'Find one permission',
                params: validationMetadatasToSchemas().IdValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.read'], false)],
            handler: this._handler.find,
            schema: {
                tags: ['Admin'],
                summary: 'Find by clause permission',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/all',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.update'], false)],
            handler: this._handler.updateAll,
            schema: {
                tags: ['Admin'],
                summary: 'Update all permissions',
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.update'], false)],
            handler: this._handler.updateOneById,
            schema: {
                tags: ['Admin'],
                summary: 'Update one permission',
                params: validationMetadatasToSchemas().IdValidator,
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'PUT',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.delete'], false)],
            handler: this._handler.update,
            schema: {
                tags: ['Admin'],
                summary: 'Update by clause permission',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/all',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.delete'], false)],
            handler: this._handler.deleteAll,
            schema: {
                tags: ['Admin'],
                summary: 'Delete all permissions',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.delete'], false)],
            handler: this._handler.deleteOneById,
            schema: {
                tags: ['Admin'],
                summary: 'Delete one permission',
                params: validationMetadatasToSchemas().IdValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.delete'], false)],
            handler: this._handler.delete,
            schema: {
                tags: ['Admin'],
                summary: 'Delete by clause permission',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/truncate',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.delete'], false)],
            handler: this._handler.truncate,
            schema: {
                tags: ['Admin'],
                summary: 'Truncate permission',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/count',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'permission', 'permission.read'], false)],
            handler: this._handler.count,
            schema: {
                tags: ['Admin'],
                summary: 'Count permission',
            },
            attachValidation: true
        });

    }
}
