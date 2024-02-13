import { FastifyReply, FastifyRequest } from 'fastify';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Config/I18n';
import { ILoginDTO, IRegisterDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { CredentialValidator, LoginValidator, RegisterValidator } from '@/Validator';
import { Delete, Login, Logout, Register, Update } from '@/Domain/UseCase/Auth';

export class AuthHandler extends AbstractHandler {
    private readonly _registerUseCase: Register = new Register();
    private readonly _loginUseCase: Login = new Login();
    private readonly _logoutUseCase: Logout = new Logout();
    private readonly _deleteUseCase: Delete = new Delete();
    private readonly _updateUseCase: Update = new Update();

    public register = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: IRegisterDTO = this._basaltKeyInclusionFilter.filter<IRegisterDTO>(req.body as IRegisterDTO, ['username', 'email', 'password'], true);
            const registerValidator: RegisterValidator<IRegisterDTO> = new RegisterValidator(dataDTO);
            await this.validate(registerValidator, req.headers['accept-language']);
            await this._registerUseCase.execute(dataDTO, req.headers['accept-language']);
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.register', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public login = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: Partial<ILoginDTO> = this._basaltKeyInclusionFilter.filter<ILoginDTO>(req.body as ILoginDTO, ['username', 'email', 'password'], true);
            const loginValidator: LoginValidator = new LoginValidator(dataDTO);
            await this.validate(loginValidator, req.headers['accept-language']);
            const token: string = await this._loginUseCase.execute(dataDTO);
            this.addCookie(reply, 'token', token, 1000 * 60 * 60 * 24);
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.login', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public logout = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this._logoutUseCase.execute(req.cookies.token as string);
            this.clearCookie(reply, 'token');
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.logout', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public delete = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            await this._deleteUseCase.execute(req.cookies.token as string, req.headers['accept-language']);
            this.clearCookie(reply, 'token');
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.delete', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public update = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: Partial<ICrendentialDTO> = this._basaltKeyInclusionFilter.filter<ICrendentialDTO>(req.body as ICrendentialDTO, ['username', 'email', 'password'], true);
            const credentialValidator: CredentialValidator<ICrendentialDTO> = new CredentialValidator(dataDTO);
            await this.validate(credentialValidator, req.headers['accept-language']);
            const result: Pick<ICrendentialDTO, 'username' | 'email'>[] = await this._updateUseCase.execute(req.cookies.token as string, dataDTO);
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.authHandler.update', reply.request.headers['accept-language']),
                result
            );
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public tokenCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.token-check', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public blacklistCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this.sendResponse(reply, 200, I18n.translate('http.handler.authHandler.token-check', reply.request.headers['accept-language']));
        } catch (e) {
            this.sendError(reply, e);
        }
    };
}
