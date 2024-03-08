import { FastifyInstance } from 'fastify';

import { AuthHandler } from '@/HTTP/Handler';
import { BlacklistedChecker, PermissionChecker, TokenChecker } from '@/HTTP/Middleware';
import { AbstractRouter } from '@/HTTP/Router';
import { LoginSchema, RegisterSchema, CredentialSchema } from '@/Schema';

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
                body: RegisterSchema,
                security: []
            },
        });

        fastify.route({
            method: 'POST',
            url: '/login',
            handler: this._handler.login,
            schema: {
                tags: ['Auth'],
                summary: 'Login a user',
                body: LoginSchema,
                security: []
            },
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
        });

        fastify.route({
            method: 'DELETE',
            url: '/delete',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'credential', 'credential.delete'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.delete,
            schema: {
                tags: ['Auth'],
                summary: 'Delete a user',
            },
        });

        fastify.route({
            method: 'PUT',
            url: '/update',
            preHandler: [
                TokenChecker.execute,
                PermissionChecker.execute(['admin', 'credential', 'credential.update'], false),
                BlacklistedChecker.execute
            ],
            handler: this._handler.update,
            schema: {
                tags: ['Auth'],
                summary: 'Update a user',
                body: CredentialSchema,
            },
        });

        fastify.route({
            method: 'GET',
            url: '/token-check',
            preHandler: TokenChecker.execute,
            handler: this._handler.tokenCheck,
            schema: {
                tags: ['Auth'],
                summary: 'Check a token',
            },
            attachValidation: true
        });

        fastify.route({
            method: 'GET',
            url: '/blacklist-check',
            preHandler: BlacklistedChecker.execute,
            handler: this._handler.blacklistCheck,
            schema: {
                deprecated: true,
                tags: ['Auth'],
                summary: 'Check if credential is blacklist',
            },
        });

        fastify.route({
            method: 'GET',
            url: '/token-and-blacklist-check',
            preHandler: [TokenChecker.execute, BlacklistedChecker.execute],
            handler: this._handler.blacklistCheck,
            schema: {
                deprecated: true,
                tags: ['Auth'],
                summary: 'Check if credential is blacklist',
            },
        });
    }
}
