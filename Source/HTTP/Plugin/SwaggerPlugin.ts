import fastifySwagger from '@fastify/swagger';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { FastifyInstance } from 'fastify';

import { EnvironmentConfiguration, packageJsonConfiguration } from '@/Config';
import { IPlugin } from '@/HTTP/Interface';

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
                servers: [ { url: `${EnvironmentConfiguration.env.NODE_ENV == 'development' ? 'http' : 'https'}://${EnvironmentConfiguration.env.DOMAIN}:${EnvironmentConfiguration.env.HTTP_PORT}` } ],
                tags: [
                    { name: 'Admin-Role', description: 'Admin Role related end-points' },
                    { name: 'Admin-Permission', description: 'Admin Permission related end-points' },
                    { name: 'Auth', description: 'Auth related end-points' },
                    { name: 'Microservice', description: 'Microservice related end-points' },
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
