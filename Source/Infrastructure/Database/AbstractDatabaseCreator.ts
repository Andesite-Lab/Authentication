import { BasaltLogger } from '@basalt-lab/basalt-logger';
import { Knex, knex } from 'knex';

import { ErrorInfrastructure, ErrorInfrastructureKey } from '@/Common/Error';
import { I18n, Language } from '@/Common/Tools';
import { AbstractMigrationSourceCreator, AbstractSeedSourceCreator } from '@/Infrastructure/Database';

import Transaction = Knex.Transaction;

export type { Transaction };

export interface IErrorDatabase {
    length: number;
    name: string;
    severity: string;
    code: string;
    detail: string;
    hint: string;
    position: string;
    internalPosition: string;
    internalQuery: string;
    where: string;
    schema: string;
    table: string;
    column: string;
    dataType: string;
    constraint: string;
    file: string;
    line: string;
    routine: string;
    stack: string;
    message: string;
}

export abstract class AbstractDatabaseCreator {
    private readonly _config: Knex.Config;
    private _database: Knex | undefined;
    private _databaseName: string = '';
    private _migrationSource: AbstractMigrationSourceCreator;
    private _seedSource: AbstractSeedSourceCreator;
    private _isConnected: boolean = false;

    protected constructor(
        databaseName: string,
        migrationSource: AbstractMigrationSourceCreator,
        seedSource: AbstractSeedSourceCreator,
        config: Knex.Config
    ) {
        this._databaseName = databaseName;
        this._migrationSource = migrationSource;
        this._seedSource = seedSource;
        this._config = config;
    }

    public get database(): Knex | undefined {
        return this._database;
    }

    public get databaseName(): string {
        return this._databaseName;
    }

    public get isConnected(): boolean {
        return this._isConnected;
    }

    public connect(): void {
        try {
            this._database = knex({
                ...this._config,
            });
            this._database.raw('select 1+1 as result')
                .catch(err => {
                    throw new ErrorInfrastructure({
                        key: ErrorInfrastructureKey.DATABASE_CONNECTION_ERROR,
                        detail: err
                    });
                });
            this._isConnected = true;
            BasaltLogger.log(I18n.translate('infrastructure.database.connected', Language.EN, {
                databaseName: this._databaseName
            }));
        } catch (error) {
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DATABASE_CONNECTION_ERROR,
                detail: error,
                interpolation: {
                    databaseName: this._databaseName
                }
            });
        }
    }

    public disconnect(): void {
        try {
            this._database?.destroy();
            this._isConnected = false;
            BasaltLogger.log(I18n.translate('infrastructure.database.disconnected', Language.EN, {
                databaseName: this._databaseName
            }));
        } catch (error) {
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DATABASE_DISCONNECT_ERROR,
                detail: error,
                interpolation: {
                    databaseName: this._databaseName
                }
            });
        }
    }
    
    public async runAllMigrations(): Promise<void> {
        if (!this._database)
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DATABASE_NOT_CONNECTED,
                interpolation: {
                    databaseName: this._databaseName
                }
            });
        const result = await this._database.migrate.latest({
            migrationSource: this._migrationSource,
        });
        BasaltLogger.log({
            message: I18n.translate('infrastructure.database.run_all_mirations', Language.EN, {
                databaseName: this._databaseName
            }),
            result
        });
    }
    
    public async rollbackAllMigrations(): Promise<void> {
        if (!this._database)
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DATABASE_NOT_CONNECTED,
                interpolation: {
                    databaseName: this._databaseName
                }
            });
        const result = await this._database.migrate.rollback({
            migrationSource: this._migrationSource,
        }, true);
        BasaltLogger.log({
            message: I18n.translate('infrastructure.database.rollback_all_migrations', Language.EN, {
                databaseName: this._databaseName
            }),
            result
        });
    }
    
    public async runAllSeeds(): Promise<void> {
        if (!this._database)
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DATABASE_NOT_CONNECTED,
                interpolation: {
                    databaseName: this._databaseName
                }
            });
        const result = await this._database.seed.run({
            seedSource: this._seedSource,
        });
        BasaltLogger.log({
            message: I18n.translate('infrastructure.database.run_all_seeds', Language.EN, {
                databaseName: this._databaseName
            }),
            result
        });
    }
}
