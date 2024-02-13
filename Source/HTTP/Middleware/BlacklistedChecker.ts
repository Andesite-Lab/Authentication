import { FastifyReply, FastifyRequest } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';
import { randomInt } from 'crypto';

import { PermissionChecker } from '@/HTTP/Middleware/PermissionChecker';
import { ITokenPayloadDTO } from '@/Data/DTO';
import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { ErrorEntity, ErrorMiddleware, ErrorMiddlewareKey } from '@/Common/Error';

export class BlacklistedChecker {
    private static _credentialModel: CredentialModel = new CredentialModel();
    private static _imagesBuffer: Map<string, Buffer> = new Map<string, Buffer>();

    private static async checkBlacklisted(uuid: string) {
        const credentialDTO: Pick<ICrendentialDTO, 'blacklisted'> | undefined = await BlacklistedChecker._credentialModel.findOne([{
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
            const token: string = req.cookies.token || '';
            const tokenPayload: ITokenPayloadDTO = PermissionChecker.getPayload(token);
            await BlacklistedChecker.checkBlacklisted(tokenPayload.uuid);
        } catch (error) {
            const pathImages: string = join(__dirname, '../Public/Images');
            const random: number = randomInt(1, 6);
            const pathBlacklisted: string = `${pathImages}/black-listed-${random}.gif`;

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
