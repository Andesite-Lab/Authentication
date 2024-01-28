import { Command } from 'commander';
import * as process from 'process';
import { BasaltLogger, ConsoleLoggerStrategy } from '@basalt-lab/basalt-logger';

import {
    EnvironmentConfiguration,
    I18n,
    Language,
    packageJsonConfiguration
} from '@/Config';
import { HttpServerManager } from '@/HTTP/HttpServerManager';
import { RedPandaProducer } from '@/Infrastructure/RedPanda/Producer';
import { RedPandaLoggerStrategy } from '@/Common';
import { MainDatabase } from '@/Infrastructure/Database/Main/MainDatabase';
import { ErrorEntity } from '@/Common/Error';
import { Dragonfly } from '@/Infrastructure/Store';

if (EnvironmentConfiguration.env.NODE_ENV === 'development')
    require('source-map-support/register');

class App {
    private _httpServerManager: HttpServerManager = new HttpServerManager();

    public async connectToRedPanda(): Promise<void> {
        await RedPandaProducer.instance.connect();
        BasaltLogger.addStrategy('RedPanda', new RedPandaLoggerStrategy());
        BasaltLogger.log(I18n.translate('app.redpanda.REDPANDA_PRODUCER_CONNECTED', Language.EN));
    }

    public async disconnectFromRedPanda(): Promise<void> {
        await RedPandaProducer.instance.disconnect();
        if (BasaltLogger.strategies.has('RedPanda'))
            BasaltLogger.removeStrategy('RedPanda');
        BasaltLogger.log(I18n.translate('app.redpanda.REDPANDA_PRODUCER_DISCONNECTED', Language.EN));
    }

    public connectToDatabase(): void {
        MainDatabase.instance.connect();
        BasaltLogger.log(I18n.translate('app.database.DB_CONNECTED', Language.EN));
    }

    public disconnectFromDatabase(): void {
        MainDatabase.instance.disconnect();
        BasaltLogger.log(I18n.translate('app.database.DB_DISCONNECTED', Language.EN));
    }

    public async runHttpServer(): Promise<void> {
        await this._httpServerManager.start(EnvironmentConfiguration.env.HTTP_PORT);
        BasaltLogger.log(I18n.translate('app.httpServer.HTTP_SERVER_LISTENING', Language.EN, {
            port: EnvironmentConfiguration.env.HTTP_PORT,
            mode: EnvironmentConfiguration.env.NODE_ENV,
            prefix: EnvironmentConfiguration.env.PREFIX,
            pid: process.pid,
        }));
    }

    public connectToDragonfly(): void {
        Dragonfly.instance.connect();
        BasaltLogger.log(I18n.translate('app.dragonfly.DRAGONFLY_CONNECTED', Language.EN));
    }

    public disconnectFromDragonfly(): void {
        Dragonfly.instance.disconnect();
        BasaltLogger.log(I18n.translate('app.dragonfly.DRAGONFLY_DISCONNECTED', Language.EN));
    }

    public async stopHttpServer(): Promise<void> {
        await this._httpServerManager?.stop();
        BasaltLogger.log(I18n.translate('app.httpServer.HTTP_SERVER_CLOSE', Language.EN));
    }

    public async runMigrations(): Promise<void> {
        const result = await MainDatabase.instance.runMigrations();
        BasaltLogger.log({
            message: I18n.translate('app.database.DB_MIGRATIONS_RUN', Language.EN),
            result
        });
    }

    public async rollbackAllMigrations(): Promise<void> {
        const result = await MainDatabase.instance.rollbackAllMigration();
        BasaltLogger.log({
            message: I18n.translate('app.database.DB_MIGRATIONS_ROLLBACK_ALL', Language.EN),
            result
        });
    }

    public async rollbackLastMigration(): Promise<void> {
    }

    public async runSeeders(): Promise<void> {
        const result = await MainDatabase.instance.runSeeders();
        BasaltLogger.log({
            message: I18n.translate('app.database.DB_SEEDERS_RUN', Language.EN),
            result
        });
    }

    public async start(): Promise<void> {
        // Connect to brokers and initialize producer
        await this.connectToRedPanda();

        // Connect to database
        this.connectToDatabase();

        // Connect to dragonfly
        this.connectToDragonfly();

        // Run HTTP server
        await this.runHttpServer();

        BasaltLogger.log({
            message: I18n.translate('app.start', Language.EN, {
                name: packageJsonConfiguration.name
            }),
            host: EnvironmentConfiguration.env.HOST,
            prefix: EnvironmentConfiguration.env.PREFIX,
            httpPort: EnvironmentConfiguration.env.HTTP_PORT,
            wsPort: EnvironmentConfiguration.env.WS_PORT,
            dbHost: EnvironmentConfiguration.env.DB_HOST,
            dbPort: EnvironmentConfiguration.env.DB_PORT,
        });
    }

    public async stop(): Promise<void> {
        // Stop HTTP server
        await this.stopHttpServer();

        // Disconnect from database
        this.disconnectFromDatabase();

        // Disconnect from dragonfly
        this.disconnectFromDragonfly();

        // Disconnect from brokers RedPanda
        await this.disconnectFromRedPanda();

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
        const app: App = new App();
        try {
            BasaltLogger.addStrategy('console', new ConsoleLoggerStrategy());
            await app.connectToRedPanda();
            app.connectToDatabase();

            if (options.rollback)
                console.log('Rolling back the last migration');
            else if (options.rollbackAll)
                await app.rollbackAllMigrations();
            else
                await app.runMigrations();
        } catch (error) {
            if (error instanceof ErrorEntity) {
                error.message = I18n.translate(error.message, Language.EN);
                BasaltLogger.error(error);
            }
        } finally {
            setTimeout((): void => {
                process.exit(0);
            }, 300);
        }
    });

commander
    .command('seed')
    .description('Run seeders')
    .action(async (): Promise<void> => {
        const app: App = new App();
        try {
            BasaltLogger.addStrategy('console', new ConsoleLoggerStrategy());
            await app.connectToRedPanda();
            app.connectToDatabase();
            await app.runSeeders();
        } catch (error) {
            if (error instanceof ErrorEntity) {
                error.message = I18n.translate(error.message, Language.EN);
                BasaltLogger.error(error);
            }
        } finally {
            setTimeout((): void => {
                process.exit(0);
            }, 300);
        }
    });

commander.action(async (): Promise<void> => {
    const app: App = new App();
    try {
        BasaltLogger.addStrategy('console', new ConsoleLoggerStrategy());
        await app.start();
    } catch (error) {
        if (error instanceof ErrorEntity) {
            error.message = I18n.translate(error.message, Language.EN);
            BasaltLogger.error(error);
        }
        await app.stop();
    }

    // process.on('SIGINT', async (): Promise<void> => {
    //     BasaltLogger.log(I18n.translate('app.signal.SIGINT', Language.EN));
    //     await app.stop();
    //     BasaltLogger.log(I18n.translate('app.stop', Language.EN, {
    //         name: packageJsonConfiguration.name
    //     }));
    // });
});
commander.parse(process.argv);
