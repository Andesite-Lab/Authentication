import { Knex } from 'knex';

import { ErrorInfrastructure, ErrorInfrastructureKey } from '@/Common/Error';
import { AbstractDatabaseCreator } from '@/Infrastructure/Database';
import { DynamicDB } from '@/Infrastructure/Database/DynamicDB';
import { AuthenticationDatabase } from '@/Infrastructure/Database/StaticDB';

export class DatabaseManager {
    private _databases: Map<string, AbstractDatabaseCreator> = new Map<string, AbstractDatabaseCreator>();
    private static _instance: DatabaseManager;

    public static get instance(): DatabaseManager {
        if (!DatabaseManager._instance)
            DatabaseManager._instance = new DatabaseManager();
        return DatabaseManager._instance;
    }

    private constructor() {
        this.initStaticDatabase();
    }

    public getDatabaseInstance(databaseName: string): Knex {
        if (this._databases.has(databaseName))
            return this._databases.get(databaseName)?.database as Knex;
        else
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DATABASE_NOT_CONNECTED,
                interpolation: {
                    databaseName
                }
            });
    }

    public connectDatabases(): void {
        this._databases.forEach((db) => {
            if (!db.isConnected)
                db.connect();
        });
    }
    
    public disconnectDatabases(): void {
        this._databases.forEach((db) => {
            if (db.isConnected)
                db.disconnect();
        });
    }

    private initStaticDatabase(): void {
        this._databases.set('authentication', new AuthenticationDatabase());
    }

    public addDynamicDatabase(dynamicDBName: string): void {
        if (!this._databases.has(dynamicDBName)) {
            const dynamicDB = new DynamicDB(dynamicDBName);
            this._databases.set(dynamicDBName, dynamicDB);
            dynamicDB.connect();
        }
    }

    public removeDynamicDatabase(dynamicDBName: string): void {
        if (this._databases.has(dynamicDBName)) {
            this._databases.get(dynamicDBName)?.disconnect();
            this._databases.delete(dynamicDBName);
        }
    }

    public isDatabaseNameExists(databaseName: string): boolean {
        return this._databases.has(databaseName);
    }

    public async runAllMigration(): Promise<void> {
        for (const [, db] of this._databases)
            await db.runAllMigrations();
    }

    public async rollbackAllMigration(): Promise<void> {
        for (const [, db] of this._databases)
            await db.rollbackAllMigrations();
    }

    public async runAllSeeder(): Promise<void> {
        for (const [, db] of this._databases)
            await db.runAllSeeds();
    }

    public async runMigrationForDatabase(databaseName: string): Promise<void> {
        if (this._databases.has(databaseName)) 
            await this._databases.get(databaseName)?.runAllMigrations();
    }

    public async rollbackMigrationForDatabase(databaseName: string): Promise<void> {
        if (this._databases.has(databaseName)) 
            await this._databases.get(databaseName)?.rollbackAllMigrations();
    }

    public async runSeederForDatabase(databaseName: string): Promise<void> {
        if (this._databases.has(databaseName)) 
            await this._databases.get(databaseName)?.runAllSeeds();
    }
}