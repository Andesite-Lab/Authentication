import { FastifyReply, FastifyRequest } from 'fastify';

import { AbstractHandler } from '@/HTTP/Handler';
import { I18n } from '@/Common/Tools';
import { ILoginDTO, IRegisterDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { Delete, Login, Logout, Register, Update } from '@/Domain/UseCase/Auth';

export class AuthHandler extends AbstractHandler {
    private readonly _registerUseCase: Register = new Register();
    private readonly _loginUseCase: Login = new Login();
    private readonly _logoutUseCase: Logout = new Logout();
    private readonly _deleteUseCase: Delete = new Delete();
    private readonly _updateUseCase: Update = new Update();

    public register = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: IRegisterDTO = req.body as IRegisterDTO;
            await this._registerUseCase.execute(dataDTO, req.headers['accept-language']);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.register', req.headers['accept-language'])
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public login = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: Partial<ILoginDTO> = req.body as Partial<ILoginDTO>;
            const token: string = await this._loginUseCase.execute(dataDTO);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.login', req.headers['accept-language']),
                content: { 
                    access_token: token,
                    token_type: 'bearer'
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public logout = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this._logoutUseCase.execute(req.headers.token as string);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.logout', req.headers['accept-language'])
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public delete = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            await this._deleteUseCase.execute(req.headers.token as string, req.headers['accept-language']);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.delete', req.headers['accept-language'])
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public update = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const dataDTO: Partial<ICrendentialDTO> = req.body as ICrendentialDTO;
            const result: Pick<ICrendentialDTO, 'username' | 'email'>[] = await this._updateUseCase.execute(req.headers.token as string, dataDTO);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.update', req.headers['accept-language']),
                content: [result]
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public tokenCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.token-check', req.headers['accept-language'])
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public blacklistCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.blacklist-check', req.headers['accept-language'])
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public tokenAndBlacklistCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.authHandler.token-and-blacklist-check', req.headers['accept-language'])
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };
}
