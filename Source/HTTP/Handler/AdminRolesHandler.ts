import { FastifyRequest, FastifyReply } from 'fastify';
import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { BasaltKeyInclusionFilter } from '@basalt-lab/basalt-helper';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';
import { IRoleDTO } from '@/Data/DTO/Models';
import { IOptionFindDTO } from '@/Data/DTO';
import {
    RoleBody,
    OptionFindQuery,
    IdParam
} from '@/Validator';
import {
    CreateRole,
    ReadRoles,
    ReadRole
} from '@/Domain/UseCase';

export class AdminRolesHandler extends AbstractHandler {
    private readonly _createRoleUseCase: CreateRole = new CreateRole();
    private readonly _readRolesUseCase: ReadRoles = new ReadRoles();
    private readonly _readRoleUseCase: ReadRole = new ReadRole();

    public createRole = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const basaltKeyInclusionFilter: BasaltKeyInclusionFilter = new BasaltKeyInclusionFilter();
            const dataDTO: IRoleDTO = basaltKeyInclusionFilter.filter<IRoleDTO>(req.body as IRoleDTO, ['role'], true);
            const roleBody: RoleBody<IRoleDTO> = new RoleBody(dataDTO);
            await this.validate(roleBody, req.headers['accept-language']);
            await this._createRoleUseCase.execute(dataDTO.role);
            this.sendResponse(reply, 200, I18n.translate('http.handler.adminHandler.createRole', reply.request.headers['accept-language']));
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public getRoles = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const basaltKeyInclusionFilter: BasaltKeyInclusionFilter = new BasaltKeyInclusionFilter();
            const dataDTO: IOptionFindDTO = basaltKeyInclusionFilter.filter<IOptionFindDTO>(req.query as IOptionFindDTO || {}, ['limit', 'offset'], true);
            const optionFindQuery: OptionFindQuery<IOptionFindDTO> = new OptionFindQuery(dataDTO);
            await this.validate(optionFindQuery, req.headers['accept-language']);
            const roles: IRoleDTO[] = await this._readRolesUseCase.execute(dataDTO);
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.adminHandler.getRoles', reply.request.headers['accept-language']),
                {
                    roles,
                    count: roles.length,
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

    public getRole = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const basaltKeyInclusionFilter: BasaltKeyInclusionFilter = new BasaltKeyInclusionFilter();
            const dataDTO: { id: string } = basaltKeyInclusionFilter
                .filter<{ id: string }>(
                    req.params as { id: string },
                    ['id'],
                    true
                );
            const idParam: IdParam = new IdParam(dataDTO.id);
            await this.validate(idParam, req.headers['accept-language']);
            const role: IRoleDTO | undefined = await this._readRoleUseCase.execute(parseInt(dataDTO.id));
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.adminHandler.getRoles', reply.request.headers['accept-language']),
                {
                    role,
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
