import { BasaltLogger } from '@basalt-lab/basalt-logger';
import Ajv from 'ajv';
import AjvError from 'ajv-errors';
import AjvFormats from 'ajv-formats';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { I18n, Language } from '@/Common/Tools';
import { EnvironmentConfiguration } from '@/Config';
import { IOnRequestHttpDTO } from '@/Data/DTO';
import { OnSendHook } from '@/HTTP/Hook';
import { IHook, IPlugin, IRouter } from '@/HTTP/Interface';
import {
    CorsPlugin,
    FormbodyPlugin,
    HelmetPlugin,
    RateLimitPlugin,
    SwaggerPlugin,
    SwaggerUiPlugin
} from '@/HTTP/Plugin';
import { AdminPermissionsRouter, AdminRolesRouter, AuthRouter, MicroserviceRouter } from '@/HTTP/Router';

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
            new MicroserviceRouter('/microservice'),
            new AuthRouter('/'),
            new AdminRolesRouter('/admin/roles'),
            new AdminPermissionsRouter('/admin/permissions'),
        ];
    }

    private initializePlugin(): IPlugin[] {
        return [
            new CorsPlugin(),
            new FormbodyPlugin(),
            new HelmetPlugin(),
            new RateLimitPlugin(),
            new SwaggerPlugin(),
            new SwaggerUiPlugin()
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

    private initializeAJV(): void {
        const ajv = new Ajv({
            removeAdditional: false,
            allErrors: true,
            $data: true,
            coerceTypes: true,
            allowUnionTypes: true
        });
        AjvError(ajv);
        AjvFormats(ajv);
        this._app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
    }

    private initializeValidationHandler(): void {
        this._app.setErrorHandler((error, request, reply) => {
            if (error.validation)  {
                const rawAjvError = error.validation;
                const sanitizedAjvError = rawAjvError.map(e => {
                    e.message = `error.errorSchema.${e.message}`;
                    if (e.instancePath === '') {
                        const [param] = e.params.errors as { params: { missingProperty: string } }[];
                        return {
                            property: param.params.missingProperty,
                            constraints: I18n.translate(e.message as string, request.headers['accept-language'])
                        };
                    }
                    return {
                        property: e.instancePath.slice(1),
                        constraints: I18n.translate(e.message as string, request.headers['accept-language'])
                    };
                });

                reply.status(400).send({
                    content: sanitizedAjvError,
                    statusCode: 400,
                });
            }

        });
    }

    private initialize(): void {
        this.initializePlugin().forEach((plugin: IPlugin) => plugin.configure(this._app));
        this.initializeRouter().forEach((router: IRouter) => router.configure(this._app, `${EnvironmentConfiguration.env.BASE_URL}`));
        this.initializeHook().forEach((hook: IHook) => hook.configure(this._app));
        this.initializeAJV();
        this.initializeValidationHandler();
    }

    public async start(): Promise<void> {
        this.initialize();
        await this._app.ready();
        await this._app.listen({
            host: '0.0.0.0',
            port: EnvironmentConfiguration.env.HTTP_PORT,
        });
        BasaltLogger.log(I18n.translate('http.listening', Language.EN, {
            port: EnvironmentConfiguration.env.HTTP_PORT,
            mode: EnvironmentConfiguration.env.NODE_ENV,
            prefix: EnvironmentConfiguration.env.BASE_URL,
            pid: process.pid,
        }));
    }

    public async stop(): Promise<void> {
        await this._app.close();
        BasaltLogger.log(I18n.translate('http.close', Language.EN));
    }
}
