import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { IPlugin } from '@/HTTP/Interface';
import { EnvironmentConfiguration, packageJsonConfiguration } from '@/Config';

export class SwaggerPlugin implements IPlugin {
    configure(app: FastifyInstance): void {
        app.register(fastifySwagger, {
            openapi: {
                info: {
                    title: packageJsonConfiguration.name,
                    description: packageJsonConfiguration.description,
                    version: packageJsonConfiguration.version,
                    license : {
                        name: packageJsonConfiguration.license,
                    },
                    contact: {
                        name: packageJsonConfiguration.author,
                    },
                },
                servers: [ { url: `https://${EnvironmentConfiguration.env.DOMAIN}:${EnvironmentConfiguration.env.HTTP_PORT}` } ],
                tags: [
                    { name: 'Admin', description: 'Admin related end-points' },
                    { name: 'Auth', description: 'Auth related end-points' },
                    { name: 'Microservice', description: 'Microservice related end-points' },
                    { name: 'Token', description: 'Token related end-points' },
                ],
                components: {
                    schemas: {
                        ...(validationMetadatasToSchemas() as object)
                    },
                    securitySchemes: {
                        cookieAuth: {
                            type: 'apiKey' as const,
                            in: 'cookie',
                            name: 'token'
                        }
                    }
                },
                security: [{ cookieAuth: [] }]
            }
        });
    }
}
