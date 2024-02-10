import { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';

import { IPlugin } from '@/HTTP/Interface';

export class CookiePlugin implements IPlugin {
    configure(app: FastifyInstance): void {
        app.register(cookie);
    }
}
