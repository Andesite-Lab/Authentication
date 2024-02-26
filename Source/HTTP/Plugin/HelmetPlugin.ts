import helmet from '@fastify/helmet';
import { FastifyInstance } from 'fastify';

import { IPlugin } from '@/HTTP/Interface';

export class HelmetPlugin implements IPlugin {
    configure(app: FastifyInstance): void {
        app.register(helmet, { global: true });
    }
}
