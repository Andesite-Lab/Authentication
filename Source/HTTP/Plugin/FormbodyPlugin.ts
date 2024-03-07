import formBody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';

import { IPlugin } from '@/HTTP/Interface';

export class FormbodyPlugin implements IPlugin {
    public configure(app: FastifyInstance): void {
        app.register(formBody);
    }
}
