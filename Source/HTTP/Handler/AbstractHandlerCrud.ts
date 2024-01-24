import { FastifyReply, FastifyRequest } from 'fastify';
import { BasaltLogger } from '@basalt-lab/basalt-logger';

import { AbstractHandler } from '@/HTTP/Handler/AbstractHandler';
import { Insert, FindAll, FindOne } from '@/Domain/UseCase/CRUD';
import { I18n } from '@/Config';
import { PaginationOptionsValidator, IdValidator, UuidValidator } from '@/Validator';
import { IPaginationOptionsDTO, IWhereClauseDTO } from '@/Data/DTO';

export class AbstractHandlerCrud<T extends NonNullable<unknown>, U> extends AbstractHandler {
    private readonly _tableName: string;
    private readonly _keyInclusionFilter: (keyof T)[];
    private readonly _keyInclusionFilterWhereClause: (keyof IWhereClauseDTO)[] = ['$in', '$nin', '$eq', '$neq', '$match', '$lt', '$lte', '$gt', '$gte'];
    private readonly _validator: new (data: T) => U;
    private readonly _insertUseCase: Insert<T>;
    private readonly _findAllUseCase: FindAll<T>;
    private readonly _findOneUseCase: FindOne<T>;
    // private readonly _updateUseCase;

    public constructor(config: {
        tableName: string
        keyInclusionFilter: (keyof T)[],
        validator: new (data: T) => U
    }) {
        super();
        this._tableName = config.tableName;
        this._keyInclusionFilter = config.keyInclusionFilter;
        this._validator = config.validator;
        this._insertUseCase = new Insert<T>(config.tableName);
        this._findAllUseCase = new FindAll<T>(config.tableName);
        this._findOneUseCase = new FindOne<T>(config.tableName);
    }

    private insertEntities = async (entities: T[], language: string): Promise<void> => {
        const filteredEntities: T[] = entities.map((entity: T) => this._basaltKeyInclusionFilter.filter<T>(entity, this._keyInclusionFilter, true));
        const validatedEntities: U[] = filteredEntities.map((entity: T) => new this._validator(entity));
        await Promise.all(validatedEntities.map(async (entity: U): Promise<void> => await this.validate(entity as object, language)));
        await this._insertUseCase.execute(filteredEntities);
    };

    private checkReqPaginationOptions = (obj: unknown): IPaginationOptionsDTO | undefined => {
        const rawOptions: { options: string } = obj as { options: string };
        if (!rawOptions.options)
            return undefined;
        return this._basaltKeyInclusionFilter
            .filter<IPaginationOptionsDTO>(
                JSON.parse(rawOptions.options) as IPaginationOptionsDTO || {},
                ['limit', 'offset'],
                true
            );
    };

    public insert = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const bodies: T[] = Array.isArray(req.body) ? req.body : [req.body];
            await this.insertEntities(bodies, reply.request.headers['accept-language'] || 'en');
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.CRUD.insert', reply.request.headers['accept-language'], {
                    tableName: this._tableName,
                })
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

    public findAll = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const paginationOptionsDTO: IPaginationOptionsDTO | undefined = this.checkReqPaginationOptions(req.query);
            const paginationOptionsValidator: PaginationOptionsValidator<IPaginationOptionsDTO> = new PaginationOptionsValidator(paginationOptionsDTO);
            await this.validate(paginationOptionsValidator, req.headers['accept-language']);
            const data: T[] = await this._findAllUseCase.execute(paginationOptionsDTO);
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.CRUD.findAll', reply.request.headers['accept-language'], {
                    tableName: this._tableName,
                }),
                {
                    data,
                    count: data.length,
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

    public findOneById = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const filteredId: { id: string } = this._basaltKeyInclusionFilter
                .filter<{ id: string }>(req.params as { id: string }, ['id'], true);
            const idValidator: IdValidator = new IdValidator(filteredId.id);
            await this.validate(idValidator, req.headers['accept-language']);
            const data: T | undefined = await this._findOneUseCase.execute({
                id: parseInt(filteredId.id),
            } as unknown as T);
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.CRUD.findOne', reply.request.headers['accept-language'], {
                    tableName: this._tableName,
                }),
                {
                    data,
                });

        } catch (e) {
            if (e instanceof Error)
                BasaltLogger.error({
                    error: e,
                    trace: e.stack,
                });
            this.sendError(reply, e);
        }
    };

    public findOneByUuid = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const filteredUuid: { uuid: string } = this._basaltKeyInclusionFilter
                .filter<{ uuid: string }>(req.params as { uuid: string }, ['uuid'], true);
            const uuidValidator: UuidValidator = new UuidValidator(filteredUuid.uuid);
            await this.validate(uuidValidator, req.headers['accept-language']);

            const data: T | undefined = await this._findOneUseCase.execute({
                uuid: filteredUuid.uuid,
            } as unknown as T);
            this.sendResponse(
                reply,
                200,
                I18n.translate('http.handler.CRUD.findOne', reply.request.headers['accept-language'], {
                    tableName: this._tableName,
                }),
                {
                    data,
                });

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
