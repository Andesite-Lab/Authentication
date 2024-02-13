import { FastifyReply, FastifyRequest } from 'fastify';
import { BasaltLogger } from '@basalt-lab/basalt-logger';

import { PermissionChecker } from '@/HTTP/Middleware/PermissionChecker';
import { ITokenPayloadDTO } from '@/Data/DTO';
import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { ErrorEntity, ErrorMiddleware, ErrorMiddlewareKey } from '@/Common/Error';
import { I18n } from '@/Config';


export class BlacklistedChecker {
    private static _credentialModel: CredentialModel = new CredentialModel();

    private static async checkBlacklisted(uuid: string) {
        const credentialDTO: Pick<ICrendentialDTO, 'blacklisted'> | undefined = await BlacklistedChecker._credentialModel.findOne([{
            uuid
        }], {
            blacklisted: true
        });
        if (credentialDTO && credentialDTO.blacklisted)
            throw new ErrorMiddleware({
                key: ErrorMiddlewareKey.TOKEN_BLACKLISTED,
            });
    }

    public static async execute(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const token: string = req.cookies.token || '';
            const tokenPayload: ITokenPayloadDTO = PermissionChecker.getPayload(token);
            await BlacklistedChecker.checkBlacklisted(tokenPayload.uuid);
        } catch (error) {
            if (error instanceof Error)
                BasaltLogger.error({
                    error,
                    trace: error.stack,
                });
            if (error instanceof ErrorEntity)
                reply.status(error.code).send({
                    code: error.code,
                    content: I18n.translate(error.message, reply.request.headers['accept-language'], error.interpolation)
                });
        }
    }
}
