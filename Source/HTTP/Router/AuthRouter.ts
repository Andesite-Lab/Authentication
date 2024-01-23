import { FastifyInstance } from 'fastify';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { AbstractRouter } from '@/HTTP/Router';
import { AuthHandler } from '@/HTTP/Handler';
import { PermissionChecker, TokenChecker } from '@/HTTP/Middleware';

export class AuthRouter extends AbstractRouter<AuthHandler> {
    public constructor(routerPrefix: string = '/auth') {
        super(new AuthHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'POST',
            url: '/register',
            handler: this._handler.register,
            schema: {
                tags: ['Auth'],
                summary: 'Register a new user',
                body: validationMetadatasToSchemas().RegisterBody,
                security: []
            },
            attachValidation: true
        });

        fastify.route({
            method: 'POST',
            url: '/login',
            handler: this._handler.login,
            schema: {
                tags: ['Auth'],
                summary: 'Login a user',
                body: validationMetadatasToSchemas().LoginBody,
                security: []
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/logout',
            preHandler: TokenChecker.execute,
            handler: this._handler.logout,
            schema: {
                tags: ['Auth'],
                summary: 'Logout a user',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'DELETE',
            url: '/delete',
            preHandler: [TokenChecker.execute, PermissionChecker.execute(['admin', 'credential', 'credential.delete'], false)],
            handler: this._handler.delete,
            schema: {
                tags: ['Auth'],
                summary: 'Delete a user',
            },
            attachValidation: true
        });

    }
}
