import { EnvironmentConfiguration } from '@/Config';
import { AbstractDatabaseCreator } from '@/Infrastructure/Database';
import { MigrationSource } from './Migration';
import { SeedSource } from './Seed';

export class AuthenticationDatabase extends AbstractDatabaseCreator {
    public constructor() {
        super(
            'authentication',
            new MigrationSource(),
            new SeedSource(),
            {
                client: 'pg',
                connection: {
                    host: EnvironmentConfiguration.env.DB_SERVER_HOST,
                    user: EnvironmentConfiguration.env.DB_SERVER_USER,
                    password: EnvironmentConfiguration.env.DB_SERVER_PASSWORD,
                    database: 'authentication',
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
