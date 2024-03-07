import { randomInt } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

import { ErrorEntity, ErrorMiddleware, ErrorMiddlewareKey } from '@/Common/Error';
import { ITokenPayloadDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { PermissionChecker } from '@/HTTP/Middleware/PermissionChecker';
import { CredentialModel } from '@/Infrastructure/Repository/Model';

export class BlacklistedChecker {
    private static _imagesBuffer: Map<string, Buffer> = new Map<string, Buffer>();

    private static async checkBlacklisted(uuid: string) {
        const credentialModel: CredentialModel = new CredentialModel();
        const credentialDTO: Pick<ICrendentialDTO, 'blacklisted'> | undefined = await credentialModel.findOne([{
            uuid
        }], {
            blacklisted: true
        });
        if (credentialDTO && credentialDTO.blacklisted)
            throw new ErrorMiddleware({
                key: ErrorMiddlewareKey.CREDENTIAL_BLACKLISTED,
            });
    }

    public static async execute(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const authorization: string | undefined = req.headers?.authorization;
            if (!authorization)
                throw new ErrorMiddleware({
                    key: ErrorMiddlewareKey.TOKEN_NO_FOUND,
                });
            const token: string = authorization.split(' ')[1];
            const tokenPayload: ITokenPayloadDTO = PermissionChecker.getPayload(token);
            await BlacklistedChecker.checkBlacklisted(tokenPayload.uuid);
        } catch (error) {
            const pathImages: string = join(__dirname, '../Public/Images');
            const random: number = randomInt(1, 6);
            const pathBlacklisted: string = `${pathImages}/black-listed-${random}.gif`;
            console.error(error);

            if (!BlacklistedChecker._imagesBuffer.has(pathBlacklisted))
                BlacklistedChecker._imagesBuffer.set(pathBlacklisted, readFileSync(pathBlacklisted));
            const blacklistedImage: Buffer = BlacklistedChecker._imagesBuffer.get(pathBlacklisted) as Buffer;

            if (error instanceof ErrorEntity)
                reply.status(error.code)
                    .type('image/gif')
                    .send(blacklistedImage);
        }
    }
}
