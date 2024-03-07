import { fastifySwaggerUi, FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

import { EnvironmentConfiguration, packageJsonConfig } from '@/Config';
import { IPlugin } from '@/HTTP/Interface';

export class SwaggerUiPlugin implements IPlugin {
    public configure(app: FastifyInstance): void {
        const pathLogo: string = join(__dirname, '../Public/Logo');
        const swaggerUiOptions: FastifySwaggerUiOptions = {
            routePrefix: `${EnvironmentConfiguration.env.BASE_URL}/swagger`,
            theme: {
                title: `${packageJsonConfig.name} - API`,
                favicon: [
                    {
                        filename: 'android-chrome-192x192',
                        rel: 'icon',
                        type: 'image/png',
                        sizes: '192x192',
                        content: readFileSync(join(pathLogo, '/android-chrome-192x192.png')),
                    },

                    {
                        filename: 'android-chrome-512x512',
                        rel: 'icon',
                        type: 'image/png',
                        sizes: '512x512',
                        content: readFileSync(join(pathLogo, '/android-chrome-512x512.png')),
                    },
                    {
                        filename: 'apple-touch-icon',
                        rel: 'icon',
                        type: 'image/png',
                        sizes: '180x180',
                        content: readFileSync(join(pathLogo, '/apple-touch-icon.png')),
                    },
                    {
                        filename: 'favicon-16x16',
                        rel: 'icon',
                        type: 'image/png',
                        sizes: '16x16',
                        content: readFileSync(join(pathLogo, '/favicon-16x16.png')),
                    },
                    {
                        filename: 'favicon-32x32',
                        rel: 'icon',
                        type: 'image/png',
                        sizes: '32x32',
                        content: readFileSync(join(pathLogo, '/favicon-32x32.png')),
                    },
                    {
                        filename: 'favicon',
                        rel: 'shortcut icon',
                        type: 'image/x-icon',
                        sizes: '16x16',
                        content: readFileSync(join(pathLogo, '/favicon.ico')),
                    },
                ] as { filename: string; rel: string; type: string; sizes: string; content: string | Buffer; }[]
            },
            logo: {
                type: 'image/png',
                content: readFileSync(join(pathLogo, '/logo.png')),
            }

        };
        app.register(fastifySwaggerUi, swaggerUiOptions);
    }
}
