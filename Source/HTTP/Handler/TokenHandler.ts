import { FastifyReply, FastifyRequest } from 'fastify';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';

export class TokenHandler extends AbstractHandler {
    public check = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this.sendResponse(reply, 200, I18n.translate('http.handler.tokenHandler.check', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };
}
