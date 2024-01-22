import { FastifyRequest, FastifyReply } from 'fastify';
import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { BasaltKeyInclusionFilter } from '@basalt-lab/basalt-helper';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';
import { IRoleDTO } from '@/Data/DTO/Models';
import { IOptionFindDTO } from '@/Data/DTO';
import { RoleBody, OptionFindBody } from '@/Validator';
import { CreateRole, ReadRoles } from '@/Domain/UseCase';

export class AdminRolesHandler extends AbstractHandler {
    private readonly _createRoleUseCase: CreateRole = new CreateRole();
    private readonly _readRolesUseCase: ReadRoles = new ReadRoles();

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
            const optionFindBody: OptionFindBody<IOptionFindDTO> = new OptionFindBody(dataDTO);
            await this.validate(optionFindBody, req.headers['accept-language']);
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

}
