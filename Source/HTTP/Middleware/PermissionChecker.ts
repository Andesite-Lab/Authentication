import { BasaltToken } from '@basalt-lab/basalt-auth';
import { FastifyReply, FastifyRequest } from 'fastify';

import { BasaltAuthorization, I18n } from '@/Common/Tools';
import { ErrorEntity, ErrorMiddleware, ErrorMiddlewareKey } from '@/Common/Error';
import { ITokenPayloadDTO } from '@/Data/DTO';

export class PermissionChecker {

    public static getPayload(token: string): ITokenPayloadDTO {
        try {
            const basaltToken: BasaltToken = new BasaltToken();
            return basaltToken.getPayload(token);
        } catch (error) {
            if ((error as Error).message === 'Invalid token structure')
                throw new ErrorMiddleware({
                    key: ErrorMiddlewareKey.TOKEN_INVALID_STRUCTURE,
                });
            return {} as ITokenPayloadDTO;
        }
    }

    public static execute(permissionsToSearch: string[], multiple: boolean) {
        return function (req: FastifyRequest, reply: FastifyReply, next: () => void): void {
            try {
                const authorization: string | undefined = req.headers?.authorization;
                if (!authorization)
                    throw new ErrorMiddleware({
                        key: ErrorMiddlewareKey.TOKEN_NO_FOUND,
                    });
                const token: string = authorization.split(' ')[1];
                const tokenPayload: ITokenPayloadDTO = PermissionChecker.getPayload(token);
                if (!multiple) {
                    if (!BasaltAuthorization.instance.checkContainOneOfPermissions(permissionsToSearch, tokenPayload.rolePermission))
                        throw new ErrorMiddleware({
                            key: ErrorMiddlewareKey.PERMISSION_DENIED,
                        });
                }
                else {
                    if (!BasaltAuthorization.instance.checkContainAllOfPermissions(permissionsToSearch, tokenPayload.rolePermission))
                        throw new ErrorMiddleware({
                            key: ErrorMiddlewareKey.PERMISSION_DENIED,
                        });
                }
                next();
            } catch (error) {
                if (error instanceof ErrorEntity)
                    reply.status(error.code).send({
                        content: I18n.translate(error.message, reply.request.headers['accept-language'], error.interpolation),
                        statusCode: error.code
                    });
            }
        };
    }
}

