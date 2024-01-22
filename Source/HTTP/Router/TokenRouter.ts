import { FastifyInstance } from 'fastify';

import { AbstractRouter } from '@/HTTP/Router';
import { TokenHandler } from '@/HTTP/Handler';
import { TokenChecker } from '@/HTTP/Middleware';

export class TokenRouter extends AbstractRouter<TokenHandler> {
    constructor(routerPrefix: string = '/token') {
        super(new TokenHandler(), routerPrefix);
    }

    protected initRoutes(fastify: FastifyInstance): void {
        fastify.route({
            method: 'GET',
            url: '/check',
            preHandler: TokenChecker.execute,
            handler: this._handler.check,
            schema: {
                tags: ['Token'],
                summary: 'Check a token',
            },
            attachValidation: true
        });
    }
}
