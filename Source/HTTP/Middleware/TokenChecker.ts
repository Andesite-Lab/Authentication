import { BasaltToken } from '@basalt-lab/basalt-auth';
import { FastifyReply, FastifyRequest } from 'fastify';

import { Dragonfly } from '@/Infrastructure/Store';
import { I18n } from '@/Config';
import { ErrorEntity, ErrorMiddleware, ErrorMiddlewareKey } from '@/Common/Error';
import { ITokenPayloadDTO } from '@/Data/DTO';

export class TokenChecker {

    private static async getPublicKey(userUuid: string, tokenUuid: string): Promise<string> {
        const publicKey: string | null = await Dragonfly.instance.redis.hget(`${userUuid}:token`, tokenUuid);
        if (!publicKey)
            throw new ErrorMiddleware({
                key: ErrorMiddlewareKey.TOKEN_INVALID,
            });
        return publicKey;
    }

    private static check(token: string, publicKey: string): void {
        try {
            const basaltToken: BasaltToken = new BasaltToken();
            basaltToken.verify(token, publicKey);

        } catch (error) {
            if ((error as Error).message === 'Invalid token structure')
                throw new ErrorMiddleware({
                    key: ErrorMiddlewareKey.TOKEN_INVALID_STRUCTURE,
                });
            if ((error as Error).message === 'Token expired')
                throw new ErrorMiddleware({
                    key: ErrorMiddlewareKey.TOKEN_EXPIRED,
                });
            if ((error as Error).message === 'Invalid token signature')
                throw new ErrorMiddleware({
                    key: ErrorMiddlewareKey.TOKEN_INVALID_SIGNATURE,
                });
        }
    }

    private static getTokenUuid(token: string): string {
        try {
            const basaltToken: BasaltToken = new BasaltToken();
            return basaltToken.getTokenUuid(token);
        } catch (error) {
            if ((error as Error).message === 'Invalid token structure')
                throw new ErrorMiddleware({
                    key: ErrorMiddlewareKey.TOKEN_INVALID_STRUCTURE,
                });
            return '';
        }
    }

    public static async execute(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const token: string = req.cookies.token || '';
            const tokenUuid: string = TokenChecker.getTokenUuid(token);
            const tokenPayload: ITokenPayloadDTO = new BasaltToken().getPayload(token);
            const publicKey: string = await TokenChecker.getPublicKey(tokenPayload.uuid, tokenUuid);
            TokenChecker.check(token, publicKey);
        } catch (error) {
            if (error instanceof ErrorEntity)
                reply.status(error.code).send({
                    content: I18n.translate(error.message, reply.request.headers['accept-language'], error.interpolation),
                    statusCode: error.code
                });
        }
    }
}
