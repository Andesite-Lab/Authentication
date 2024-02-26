import { BasaltLogger, ConsoleLoggerStrategy } from '@basalt-lab/basalt-logger';
import { Command } from 'commander';
import { argv, exit } from 'process';

import { ErrorEntity } from '@/Common/Error';
import { EnvironmentConfiguration, I18n, Language, packageJsonConfiguration } from '@/Config';
import { HttpServerManager } from '@/HTTP/HttpServerManager';
import { DatabaseManager } from '@/Infrastructure/Database';
import { RedPandaProducer } from '@/Infrastructure/RedPanda/Producer';
import { Dragonfly } from '@/Infrastructure/Store';

if (EnvironmentConfiguration.env.NODE_ENV === 'development')
    require('source-map-support/register');

class App {
    private readonly _httpServerManager: HttpServerManager = new HttpServerManager();

    public async start(): Promise<void> {
        // Connect to brokers and initialize producer
        await RedPandaProducer.instance.connect();

        // Connect static databases
        DatabaseManager.instance.connectDatabases();

        // Connect to dragonfly
        Dragonfly.instance.connect();

        // Run HTTP server
        await this._httpServerManager.start();

        BasaltLogger.log({
            message: I18n.translate('app.start', Language.EN, {
                name: packageJsonConfiguration.name
            }),
            baseUrl: EnvironmentConfiguration.env.BASE_URL,
            httpPort: EnvironmentConfiguration.env.HTTP_PORT,
            wsPort: EnvironmentConfiguration.env.WS_PORT,
            dbServerHost: EnvironmentConfiguration.env.DB_SERVER_HOST,
            dbServerPort: EnvironmentConfiguration.env.DB_SERVER_PORT,
        });
    }

    public async stop(): Promise<void> {
        // Stop HTTP server
        await this._httpServerManager.stop();

        // Disconnect databases
        DatabaseManager.instance.disconnectDatabases();

        // Disconnect from dragonfly
        Dragonfly.instance.disconnect();

        // Disconnect from brokers RedPanda
        await RedPandaProducer.instance.disconnect();

        BasaltLogger.log(I18n.translate('app.stop', Language.EN, {
            name: packageJsonConfiguration.name
        }));
    }
}

const commander: Command = new Command();

commander.version(packageJsonConfiguration.version, '-v, --version', 'Output the current version');

commander
    .command('migrate')
    .description('Run database migrations')
    .option('-r, --rollback', 'Rollback the last migration')
    .option('-ra, --rollback-all', 'Rollback all migrations')
    .action(async (options: {
        rollback?: boolean;
        rollbackAll?: boolean;
    }): Promise<void> => {
        try {
            BasaltLogger.addStrategy('console', new ConsoleLoggerStrategy());

            // Connect to brokers and initialize producer
            await RedPandaProducer.instance.connect();

            // Connect to database
            DatabaseManager.instance.connectDatabases();

            if (options.rollback) 
                console.log('Rolling back the last migration');
            else if (options.rollbackAll) 
                DatabaseManager.instance.rollbackAllMigration();
            else 
                DatabaseManager.instance.runAllMigration();
            
        } catch (error) {
            if (error instanceof ErrorEntity)
                error.message = I18n.translate(error.message, Language.EN);

            BasaltLogger.error(error);
        } finally {
            setTimeout((): void => {
                exit(0);
            }, 250);
        }
    });

commander
    .command('seed')
    .description('Run seeders')
    .action(async (): Promise<void> => {
        try {
            BasaltLogger.addStrategy('console', new ConsoleLoggerStrategy());

            // Connect to brokers and initialize producer
            await RedPandaProducer.instance.connect();

            // Connect to database
            DatabaseManager.instance.connectDatabases();

            DatabaseManager.instance.runAllSeeder();
        } catch (error) {
            if (error instanceof ErrorEntity)
                error.message = I18n.translate(error.message, Language.EN);
            BasaltLogger.error(error);
        } finally {
            setTimeout((): void => {
                exit(0);
            }, 250);
        }
    });

commander.action(async (): Promise<void> => {
    const app: App = new App();
    try {
        BasaltLogger.addStrategy('console', new ConsoleLoggerStrategy());
        await app.start();
    } catch (error) {
        if (error instanceof ErrorEntity)
            error.message = I18n.translate(error.message, Language.EN);
        BasaltLogger.error(error, ['console']);
        await app.stop();
    }
});
commander.parse(argv);
