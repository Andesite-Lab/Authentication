import { FastifyRequest, FastifyReply } from 'fastify';
import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { BasaltKeyInclusionFilter } from '@basalt-lab/basalt-helper';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';
import { IPermissionDTO } from '@/Data/DTO/Models';
import { IOptionFindDTO } from '@/Data/DTO';
import {
    PermissionBody,
    OptionFindQuery,
    IdParam
} from '@/Validator';
import {
    CreatePermission,
    ReadPermissions,
    ReadPermission
} from '@/Domain/UseCase/AdminPermissions';

export class AdminPermissionsHandler extends AbstractHandler {
    private readonly _basaltKeyInclusionFilter: BasaltKeyInclusionFilter = new BasaltKeyInclusionFilter();
    private readonly _createPermission: CreatePermission = new CreatePermission();
    private readonly _readPermissionsUseCase: ReadPermissions = new ReadPermissions();
    private readonly _readPermissionUseCase: ReadPermission = new ReadPermission();

    public createPermission = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: IPermissionDTO = this._basaltKeyInclusionFilter.filter<IPermissionDTO>(req.body as IPermissionDTO, ['permission'], true);
            const roleBody: PermissionBody<IPermissionDTO> = new PermissionBody(dataDTO);
            await this.validate(roleBody, req.headers['accept-language']);
            await this._createPermission.execute(dataDTO.permission);
            this.sendResponse(reply, 200, I18n.translate('http.handler.adminPermissionHandler.createPermission', reply.request.headers['accept-language']));
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public getPermissions = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: IOptionFindDTO = this._basaltKeyInclusionFilter.filter<IOptionFindDTO>(req.query as IOptionFindDTO || {}, ['limit', 'offset'], true);
            const optionFindQuery: OptionFindQuery<IOptionFindDTO> = new OptionFindQuery(dataDTO);
            await this.validate(optionFindQuery, req.headers['accept-language']);
            const permissions: IPermissionDTO[] = await this._readPermissionsUseCase.execute(dataDTO);
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.adminPermissionHandler.getPermissions', reply.request.headers['accept-language']),
                {
                    permissions,
                    count: permissions.length,
                }
            );
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public getPermission = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: { id: string } = this._basaltKeyInclusionFilter
                .filter<{ id: string }>(
                    req.params as { id: string },
                    ['id'],
                    true
                );
            const idParam: IdParam = new IdParam(dataDTO.id);
            await this.validate(idParam, req.headers['accept-language']);
            const permission: IPermissionDTO | undefined = await this._readPermissionUseCase.execute(parseInt(dataDTO.id));
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.adminPermissionHandler.getPermission', reply.request.headers['accept-language']),
                {
                    permission,
                }
            );
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };
}
