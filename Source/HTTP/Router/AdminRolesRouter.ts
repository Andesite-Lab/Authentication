import { FastifyInstance } from 'fastify';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { AbstractRouter } from '@/HTTP/Router';
import { AdminRolesHandler } from '@/HTTP/Handler';
import { PermissionChecker, TokenChecker } from '@/HTTP/Middleware';

export class AdminRolesRouter extends AbstractRouter<AdminRolesHandler> {
    public constructor(routerPrefix: string = '/') {
        super(new AdminRolesHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'POST',
            url: '/',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.create'], false)],
            handler: this._handler.insert   ,
            schema: {
                tags: ['Admin'],
                summary: 'Insert one role or many roles',
                body: validationMetadatasToSchemas().RoleValidator
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/all',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.read'], false)],
            handler: this._handler.findAll,
            schema: {
                tags: ['Admin'],
                summary: 'Find all roles'
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/:id',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.read'], false)],
            handler: this._handler.findOneById,
            schema: {
                tags: ['Admin'],
                summary: 'Find one role',
                params: validationMetadatasToSchemas().IdValidator
            },
            attachValidation: true
        });

        // fastify.route({
        //     method: 'GET',
        //     url: '/',
        //     preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.read'], false)],
        //     handler: this._handler.find,
        //     schema: {
        //         tags: ['Admin'],
        //         summary: 'Find by clause role',
        //         params: validationMetadatasToSchemas().WhereClauseValidator
        //     },
        //     attachValidation: true
        // });

    }
}
