import { FastifyInstance } from 'fastify';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { AbstractRouter } from '@/HTTP/Router';
import { AdminHandler } from '@/HTTP/Handler';
import { PermissionChecker, TokenChecker } from '@/HTTP/Middleware';

export class AdminRouter extends AbstractRouter<AdminHandler> {
    constructor(routerPrefix: string = '/auth') {
        super(new AdminHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'POST',
            url: '/role',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'role', 'role.create'], false)],
            handler: this._handler.createRole,
            schema: {
                tags: ['Admin'],
                summary: 'Add a new role',
                body: validationMetadatasToSchemas().RoleBody
            },
            attachValidation: true
        });

    }
}
