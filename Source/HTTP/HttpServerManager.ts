import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { IPlugin, IRouter, IHook } from '@/HTTP/Interface';
import { EnvironmentConfiguration } from '@/Config';
import {
    AdminPermissionsRouter,
    AdminRolesRouter,
    AuthRouter,
    StatusRouter,
    TokenRouter,
} from '@/HTTP/Router';
import {
    CookiePlugin,
    CorsPlugin,
    FormbodyPlugin,
    HelmetPlugin,
    RateLimitPlugin,
    SwaggerPlugin,
    SwaggerUiPlugin
} from '@/HTTP/Plugin';
import { IOnRequestHttpDTO } from '@/Data/DTO';
import { OnSendHook } from '@/HTTP/Hook';
import { BasaltLogger } from '@basalt-lab/basalt-logger';

export class HttpServerManager {
    private readonly _app: FastifyInstance;

    public constructor() {
        this._app = fastify({
            ignoreTrailingSlash: true,
            trustProxy: true,
            ignoreDuplicateSlashes: true,
        });
    }

    private initializeRouter(): IRouter[] {
        return [
            new StatusRouter('/status'),
            new AuthRouter('/auth'),
            new TokenRouter('/token'),
            new AdminRolesRouter('/admin/roles'),
            new AdminPermissionsRouter('/admin/permissions'),
        ];
    }

    private initializePlugin(): IPlugin[] {
        return [
            new CookiePlugin(),
            new CorsPlugin(),
            new FormbodyPlugin(),
            new HelmetPlugin(),
            new RateLimitPlugin(),
            new SwaggerPlugin(),
            new SwaggerUiPlugin(),
        ];
    }

    private initializeHook(): IHook[] {
        const onSendHook: OnSendHook = new OnSendHook();
        onSendHook.callback = [
            (request: FastifyRequest, reply: FastifyReply): void => {
                const data: IOnRequestHttpDTO = {
                    ip: request.headers['x-real-ip'] as string || request.ip,
                    method: request.method,
                    url: request.url,
                    statusCode: reply.statusCode,
                    createdAt: new Date(),
                };
                BasaltLogger.log(data);
            }
        ];
        return [
            onSendHook,
        ];
    }

    private initialize(): void {
        this.initializePlugin().forEach((plugin: IPlugin) => plugin.configure(this._app));
        this.initializeRouter().forEach((router: IRouter) => router.configure(this._app, `${EnvironmentConfiguration.env.PREFIX}/http`));
        this.initializeHook().forEach((hook: IHook) => hook.configure(this._app));
    }

    public async start(port: number): Promise<string> {
        this.initialize();
        await this._app.ready();
        return this._app.listen({
            host: '0.0.0.0',
            port
        });
    }

    public async stop(): Promise<void> {
        return this._app.close();
    }
}
