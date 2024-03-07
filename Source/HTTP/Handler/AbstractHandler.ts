import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { FastifyReply } from 'fastify';

import { ErrorEntity } from '@/Common/Error';
import { I18n } from '@/Common/Tools';

export abstract class AbstractHandler {
    protected sendError(reply: FastifyReply, error: unknown): void {
        if (error instanceof Error)
            BasaltLogger.error({
                error,
                trace: error.stack,
            });
        if (error instanceof ErrorEntity)
            reply.status(error.code).send({
                content: I18n.translate(error.message, reply.request.headers['accept-language'], error.interpolation),
                statusCode: error.code
            });
        else
            reply.status(500).send({
                content: 'Internal Server Error',
                statusCode: 500
            });
    }

    protected sendResponse<T>(
        reply: FastifyReply,
        response: {
            statusCode: number,
            message: string,
            content?: T
        }
    ): void {
        const { statusCode, message, content } = response;
        reply
            .status(statusCode)
            .send({
                message,
                content,
                statusCode,
            });
    }
}
