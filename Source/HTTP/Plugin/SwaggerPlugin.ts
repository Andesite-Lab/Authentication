import fastifySwagger from '@fastify/swagger';
import { SchemaObject } from 'ajv';
import { FastifyInstance } from 'fastify';

import { EnvironmentConfiguration, packageJsonConfig } from '@/Config';
import { IPlugin } from '@/HTTP/Interface';
import {
    CredentialSchema,
    IdSchema,
    LoginSchema,
    RegisterSchema,
    PaginationOptionSchema,
    RoleSchema
} from '@/Schema';

export class SwaggerPlugin implements IPlugin {
    private getSchemas(): Record<string, SchemaObject> {
        return {
            CredentialSchema,
            IdSchema,
            LoginSchema,
            RegisterSchema,
            PaginationOptionsSchema: PaginationOptionSchema,
            RoleSchema
        };
    }

    public configure(app: FastifyInstance): void {
        app.register(fastifySwagger, {
            openapi: {
                info: {
                    title: packageJsonConfig.name,
                    description: packageJsonConfig.description,
                    version: packageJsonConfig.version,
                    license : {
                        name: packageJsonConfig.license,
                    },
                    contact: {
                        name: packageJsonConfig.author,
                    },
                },
                servers: [ { url: `${EnvironmentConfiguration.env.NODE_ENV == 'development' ? 'http' : 'https'}://${EnvironmentConfiguration.env.DOMAIN}:${EnvironmentConfiguration.env.HTTP_PORT}` } ],
                tags: [
                    { name: 'Admin-Role', description: 'Admin Role related end-points' },
                    { name: 'Admin-Permission', description: 'Admin Permission related end-points' },
                    { name: 'Auth', description: 'Auth related end-points' },
                    { name: 'Microservice', description: 'Microservice related end-points' },
                ],
                components: {
                    schemas: this.getSchemas(),
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http' as const,
                            scheme: 'bearer',
                            bearerFormat: 'basalt-auth',
                        },
                    }
                },
                security: [{ bearerAuth: [] }],
            }
        });
    }
}
