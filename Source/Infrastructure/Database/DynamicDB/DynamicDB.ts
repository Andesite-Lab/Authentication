import { EnvironmentConfiguration } from '@/Config';
import { AbstractDatabaseCreator } from '@/Infrastructure/Database';
import { MigrationSource } from './Migration';
import { SeedSource } from './Seed';

export class DynamicDB extends AbstractDatabaseCreator {
    public constructor(dynamicDBName: string) {
        super(
            dynamicDBName,
            new MigrationSource(),
            new SeedSource(),
            {
                client: 'pg',
                connection: {
                    host: EnvironmentConfiguration.env.DB_SERVER_HOST,
                    user: EnvironmentConfiguration.env.DB_SERVER_USER,
                    password: EnvironmentConfiguration.env.DB_SERVER_PASSWORD,
                    database: dynamicDBName,
                    port: EnvironmentConfiguration.env.DB_SERVER_PORT,
                },
                pool: {
                    min: 0,
                    max: 10,
                },
                acquireConnectionTimeout: 10000,
            });
    }
}