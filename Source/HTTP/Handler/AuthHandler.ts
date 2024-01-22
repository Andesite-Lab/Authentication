import { FastifyRequest, FastifyReply } from 'fastify';
import { BasaltKeyInclusionFilter } from '@basalt-lab/basalt-helper';
import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { BasaltToken } from '@basalt-lab/basalt-auth';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';
import { IRegisterDTO, ILoginDTO } from '@/Data/DTO';
import { RegisterBody, LoginBody } from '@/Validator';
import {
    Register,
    Login,
    Logout,
    Delete
} from '@/Domain/UseCase';

export class AuthHandler extends AbstractHandler {
    private readonly _registerUseCase: Register = new Register();
    private readonly _loginUseCase: Login = new Login();
    private readonly _logoutUseCase: Logout = new Logout();
    private readonly _deleteUseCase: Delete = new Delete();

    public register = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const basaltKeyInclusionFilter: BasaltKeyInclusionFilter = new BasaltKeyInclusionFilter();
            const dataDTO: IRegisterDTO = basaltKeyInclusionFilter.filter<IRegisterDTO>(req.body as IRegisterDTO, ['username', 'email', 'password'], true);
            const registerBody: RegisterBody<IRegisterDTO> = new RegisterBody(dataDTO);
            await this.validate(registerBody, req.headers['accept-language']);
            await this._registerUseCase.execute(dataDTO);
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.register', reply.request.headers['accept-language']));
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public login = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const basaltKeyInclusionFilter: BasaltKeyInclusionFilter = new BasaltKeyInclusionFilter();
            const dataDTO: Partial<ILoginDTO> = basaltKeyInclusionFilter.filter<ILoginDTO>(req.body as ILoginDTO, ['username', 'email', 'password'], true);
            const loginBody: LoginBody = new LoginBody(dataDTO);
            await this.validate(loginBody, req.headers['accept-language']);
            const token: string = await this._loginUseCase.execute(dataDTO);
            this.addCookie(reply, 'token', token, 1000 * 60 * 60 * 24);
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.login', reply.request.headers['accept-language']));
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public logout = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const basaltToken: BasaltToken = new BasaltToken();
            const tokenUuid: string = basaltToken.getTokenUuid(req.cookies.token as string);
            this._logoutUseCase.execute(tokenUuid);
            this.clearCookie(reply, 'token');
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.logout', reply.request.headers['accept-language']));
        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public delete = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            await this._deleteUseCase.execute(req.cookies.token as string);
            this.clearCookie(reply, 'token');
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.delete', reply.request.headers['accept-language']));
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
