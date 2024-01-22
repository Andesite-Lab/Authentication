import { FastifyRequest, FastifyReply } from 'fastify';
import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { BasaltKeyInclusionFilter } from '@basalt-lab/basalt-helper';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';
import { IRoleDTO } from '@/Data/DTO/Models';
import { RoleBody } from '@/Validator';
import { CreateRole } from '@/Domain/UseCase';

export class AdminHandler extends AbstractHandler {
    private readonly _createRoleUseCase: CreateRole = new CreateRole();

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
}
