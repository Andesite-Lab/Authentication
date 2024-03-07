import { JSONSchemaType } from 'ajv';
import { FastifyInstance } from 'fastify';
import { FastifySchema } from 'fastify/types/schema';

import { CrudHandler } from '@/HTTP/Handler/CrudHandler';
import { BlacklistedChecker, PermissionChecker, TokenChecker } from '@/HTTP/Middleware';
import { IdSchema, PaginationOptionSchema } from '@/Schema';
import { AbstractRouter } from './AbstractRouter';

export interface CrudOperationWithPermission {
    insert: string[],
    findAll: string[],
    findOne: string[],
    updateAll: string[],
    updateOne: string[],
    deleteAll: string[],
    deleteOne: string[],
    truncate: string[],
    count: string[]
}

type OperationHttpMap = { [key in keyof CrudOperationWithPermission]: ['GET' | 'POST' | 'PUT' | 'DELETE', string] };
type OperationSchemaMap = { [key in keyof CrudOperationWithPermission]: FastifySchema };

export abstract class AbstractCrudRouter<T extends NonNullable<unknown>> extends AbstractRouter<CrudHandler<T>>{
    private static _operationHttpMethodMap: OperationHttpMap = {
        insert: ['POST', '/'],
        findAll: ['GET', '/all'],
        findOne: ['GET', '/:id'],
        updateAll: ['PUT', '/all'],
        updateOne: ['PUT', '/:id'],
        deleteAll: ['DELETE', '/all'],
        deleteOne: ['DELETE', '/:id'],
        truncate: ['DELETE', '/truncate'],
        count: ['GET', '/count']
    };
    private readonly _operationSchemaMap: OperationSchemaMap;

    private readonly _crudOperationWithPermission: Partial<CrudOperationWithPermission>;
    private readonly _databaseName: string;
    private readonly _schema: JSONSchemaType<T> | undefined;
    private readonly _tableName: string;
    private readonly _tags: string;

    protected constructor(config: {
        tags?: string,
        routerPrefix: string,
        crudOperationWithPermission: Partial<CrudOperationWithPermission>,
        tableName: string,
        primaryKeyName?: [keyof T, 'NUMBER' | 'STRING'],
        databaseName: string,
        schema?: JSONSchemaType<T>
    }) 
    {
        super(new CrudHandler<T>(
            config.tableName,
            config.databaseName,
            config.primaryKeyName
        ), config.routerPrefix);

        this._crudOperationWithPermission = config.crudOperationWithPermission;
        this._databaseName = config.databaseName;
        this._schema = config.schema;
        this._tableName = config.tableName;
        this._tags = config.tags || 'CRUD';
        this._operationSchemaMap = this.initOperationSchemaMap();
    }

    private initOperationSchemaMap(): OperationSchemaMap {
        return {
            insert: {
                body: this._schema || { type: 'object' }
            },
            findAll: {
                querystring: PaginationOptionSchema
            },
            findOne: {
                params: IdSchema
            },
            updateAll: {
                body: this._schema || { type: 'object' }
            },
            updateOne: {
                body: this._schema || { type: 'object' },
                params: IdSchema
            },
            deleteAll: {},
            deleteOne: {
                params: IdSchema
            },
            truncate: {},
            count: {
            }
        };
    }

    private getPreHandlers(permissions: string[]) {
        return [
            TokenChecker.execute,
            PermissionChecker.execute(permissions, false),
            BlacklistedChecker.execute,
        ];
    }    

    private getSchemas(operations: keyof CrudOperationWithPermission): FastifySchema {
        const fastifySchema: FastifySchema = {
            tags: [this._tags],
            description: `Operation to ${operations} a ${this._tableName} in the ${this._databaseName} database`,
        };
        if (this._operationSchemaMap[operations])
            Object.assign(fastifySchema, this._operationSchemaMap[operations]);
        return fastifySchema;
    }

    private getUrls(operations: keyof CrudOperationWithPermission): string {
        return `${AbstractCrudRouter._operationHttpMethodMap[operations][1]}`;
    }

    protected initRoutes(fastify: FastifyInstance): void {
        for (const [operation, permissions] of Object.entries(this._crudOperationWithPermission))
            fastify.route({
                method: AbstractCrudRouter._operationHttpMethodMap[operation as keyof CrudOperationWithPermission][0],
                url: this.getUrls(operation as keyof CrudOperationWithPermission),
                preHandler: this.getPreHandlers(permissions),
                handler: this._handler[operation as keyof CrudHandler<T>],
                schema: this.getSchemas(operation as keyof CrudOperationWithPermission),
            });
    }
}