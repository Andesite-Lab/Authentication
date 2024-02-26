import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

import { EnvironmentConfiguration } from '@/Config';
import { IPlugin } from '@/HTTP/Interface';

export class CorsPlugin implements IPlugin {
    configure(app: FastifyInstance): void {
        app.register(cors,
            {
                origin: EnvironmentConfiguration.env.ORIGINS,
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
                credentials: true,
                optionsSuccessStatus: 200,
                preflightContinue: true
            }
        );
    }
}
