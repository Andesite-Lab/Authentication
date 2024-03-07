import { FastifyReply, FastifyRequest } from 'fastify';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Common/Tools';
import { packageJsonConfig } from '@/Config';

export class MicroserviceHandler extends AbstractHandler {
    public ping = (req: FastifyRequest, reply: FastifyReply): void => this.sendResponse(reply, {
        statusCode: 200,
        message: I18n.translate('http.handler.microserviceHandler.ping', req.headers['accept-language'])
    });

    public info = (req: FastifyRequest, reply: FastifyReply): void => {
        this.sendResponse(reply, {
            statusCode: 200,
            message: I18n.translate('http.handler.microserviceHandler.info', req.headers['accept-language']),
            content: {
                name: packageJsonConfig.name,
                description: packageJsonConfig.description,
                version: packageJsonConfig.version
            }
        });
    };
}
