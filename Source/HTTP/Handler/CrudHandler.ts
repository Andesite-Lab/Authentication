import { FastifyReply, FastifyRequest } from 'fastify';
import { BasaltToken } from '@basalt-lab/basalt-auth';

import { I18n } from '@/Common/Tools';
import { IPaginationOptionDTO } from '@/Data/DTO';
import {
    Count,
    DeleteAll,
    DeleteOne,
    FindAll,
    FindOne,
    Insert,
    Truncate,
    UpdateAll,
    UpdateOne
} from '@/Domain/UseCase/CRUD';
import { AbstractHandler } from '@/HTTP/Handler/AbstractHandler';

export class CrudHandler<T extends NonNullable<unknown>> extends AbstractHandler {
    private readonly _tableName: string;
    private _databaseName: string | undefined;
    private readonly _primaryKey: [keyof T, 'NUMBER' | 'STRING'];

    public constructor(
        tableName: string,
        databaseName?: string,
        primaryKey?: [keyof T, 'NUMBER' | 'STRING']
    ) {
        super();
        this._tableName = tableName;
        this._databaseName = databaseName;
        this._primaryKey = primaryKey || ['id' as keyof T, 'NUMBER'];
    }
    
    private getDatabaseName = (req: FastifyRequest): string => {
        const token = req.headers.token as string;
        const basaltToken: BasaltToken = new BasaltToken();
        const payload: { databaseName: string } = basaltToken.getPayload(token);
        return payload.databaseName;
    };

    public insert = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const insertUseCase = new Insert<T>(this._tableName, databaseName);
            const bodies: T[] = Array.isArray(req.body) ? req.body : [req.body];
            const data: T[] = await insertUseCase.execute(bodies) as T[];
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.insert', reply.request.headers['accept-language'], {
                    x: data.length,
                    databaseName,
                    tableName: this._tableName
                }),
                content: {
                    data,
                    count: data.length,
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public findAll = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const findAllUseCase = new FindAll<T>(this._tableName, databaseName, this._primaryKey);
            const countUseCase = new Count<T>(this._tableName, databaseName);

            const paginationOptionsDTO: IPaginationOptionDTO = req.query as IPaginationOptionDTO;
            if (!paginationOptionsDTO.limit) paginationOptionsDTO.limit = 25;

            const data: T[] = await findAllUseCase.execute(paginationOptionsDTO) as T[];
            const total: number = await countUseCase.execute() as number;
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.findAll', reply.request.headers['accept-language'], {
                    x: data.length,
                    databaseName,
                    tableName: this._tableName
                }),
                content: {
                    data,
                    count: data.length,
                    total,
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public findOne = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const findOneUseCase = new FindOne<T>(this._tableName, databaseName);

            const primaryKey: string = this._primaryKey[0] as string;
            const typeKey: 'NUMBER' | 'STRING' = this._primaryKey[1];
            const params: Record<string, string> = req.params as Record<string, string>;

            const data: T | undefined = await findOneUseCase.execute({
                [primaryKey]: typeKey === 'NUMBER' ? parseInt(params['id'] as string) : params['id']
            } as T);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.findOne', reply.request.headers['accept-language'], {
                    databaseName,
                    tableName: this._tableName
                }),
                content: {
                    data,
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public updateAll = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const updateAllUseCase = new UpdateAll<T>(this._tableName, databaseName);

            const data: T[] = await updateAllUseCase.execute(req.body as T) as T[];
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.updateAll', reply.request.headers['accept-language'], {
                    x: data.length,
                    databaseName,
                    tableName: this._tableName,
                }),
                content: {
                    data,
                    count: data.length,
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public updateOne = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const updateOneUseCase = new UpdateOne<T>(this._tableName, databaseName);

            const primaryKey: string = this._primaryKey[0] as string;
            const typeKey: 'NUMBER' | 'STRING' = this._primaryKey[1];
            const params: Record<string, string> = req.params as Record<string, string>;

            const data: T[] = await updateOneUseCase.execute(req.body as T, {
                [primaryKey]: typeKey === 'NUMBER' ? parseInt(params['id'] as string) : params['id'],
            } as unknown as T) as T[];
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.updateOne', reply.request.headers['accept-language'], {
                    databaseName,
                    tableName: this._tableName,
                }),
                content: {
                    data,
                    count: data.length,
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public deleteAll = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const deleteAllUseCase = new DeleteAll<T>(this._tableName, databaseName);
            
            const data: T[] = await deleteAllUseCase.execute() as T[];
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.deleteAll', reply.request.headers['accept-language'], {
                    x: data.length,
                    databaseName,
                    tableName: this._tableName,
                }),
                content: {
                    data,
                    count: data.length,
                }
            });

        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public deleteOne = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const deleteOneUseCase = new DeleteOne<T>(this._tableName, databaseName);

            const primaryKey: string = this._primaryKey[0] as string;
            const typeKey: 'NUMBER' | 'STRING' = this._primaryKey[1];
            const params: Record<string, string> = req.params as Record<string, string>;
            await deleteOneUseCase.execute({
                [primaryKey]: typeKey === 'NUMBER' ? parseInt(params['id'] as string) : params['id'],
            } as unknown as T);
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.deleteOne', reply.request.headers['accept-language'], {
                    databaseName,
                    tableName: this._tableName,
                })
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public truncate = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const truncateUseCase = new Truncate<T>(this._tableName, databaseName);
            await truncateUseCase.execute();
            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.truncate', reply.request.headers['accept-language'], {
                    databaseName,
                    tableName: this._tableName,
                })
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };

    public count = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const databaseName: string = this._databaseName || this.getDatabaseName(req);
            const countUseCase = new Count<T>(this._tableName, databaseName);
            const result: number = await countUseCase.execute() as number;

            this.sendResponse(reply, {
                statusCode: 200,
                message: I18n.translate('http.handler.CRUD.count', reply.request.headers['accept-language'], {
                    databaseName,
                    tableName: this._tableName,
                }),
                content: {
                    data: result,
                }
            });
        } catch (e) {
            this.sendError(reply, e);
        }
    };
}
