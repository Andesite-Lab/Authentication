import { env } from 'process';

import { ErrorConfig, ErrorConfigKey } from '@/Common/Error';

function CheckEnvVariable(_target: unknown, propertyKey: string): void {
    const value: string | undefined = env[propertyKey];
    if (!value)
        throw new ErrorConfig({
            key: `${propertyKey.toUpperCase()}_NOT_FOUND` as ErrorConfigKey
        });
}

export interface IEnvironment {
    NODE_ENV: string;

    /////// DATABASE ///////
    DB_SERVER_HOST: string;
    DB_SERVER_PASSWORD: string;
    DB_SERVER_PORT: number;
    DB_SERVER_USER: string;
    ////////////////////////

    //////// GLOBAL ////////
    DOMAIN: string;
    ORIGINS: string[];
    BASE_URL: string;
    ////////////////////////

    //////// HTTP //////////
    HTTP_PORT: number;
    ////////////////////////

    ////////// WS //////////
    WS_PORT: number;
    ////////////////////////

    //////// REDPANDA //////
    RED_PANDA_BROKERS: string[];
    ////////////////////////

    ////// DRAGONFLY ///////
    DRAGONFLY_HOST: string;
    DRAGONFLY_PORT: number;
    ////////////////////////
}

export class EnvironmentConfiguration {
    private static _instance: EnvironmentConfiguration;

    public NODE_ENV: string = env.NODE_ENV || 'development';

    /////// DATABASE ///////
    @CheckEnvVariable
    public DB_SERVER_HOST: string = env.DB_SERVER_HOST || '';

    @CheckEnvVariable
    public DB_SERVER_PASSWORD: string = env.DB_SERVER_PASSWORD || '';

    @CheckEnvVariable
    public DB_SERVER_PORT: number = env.DB_SERVER_PORT ? parseInt(env.DB_SERVER_PORT) : 0;

    @CheckEnvVariable
    public DB_SERVER_USER: string = env.DB_SERVER_USER || '';
    ////////////////////////

    //////// GLOBAL ////////
    public DOMAIN: string = env.DOMAIN || 'localhost';

    public ORIGINS: string[] = env.ORIGINS ? env.ORIGINS.split(',') : [];

    public BASE_URL: string = env.BASE_URL || '';
    ////////////////////////

    //////// HTTP //////////
    @CheckEnvVariable
    public HTTP_PORT: number = env.HTTP_PORT ? parseInt(env.HTTP_PORT) : 0;
    ////////////////////////

    ////////// WS //////////
    @CheckEnvVariable
    public WS_PORT: number = env.WS_PORT ? parseInt(env.WS_PORT) : 0;
    ////////////////////////

    //////// REDPANDA //////
    @CheckEnvVariable
    public RED_PANDA_BROKERS: string[] = env.RED_PANDA_BROKERS ? env.RED_PANDA_BROKERS.split(',') : [];
    ////////////////////////

    ////// DRAGONFLY ///////
    @CheckEnvVariable
    public DRAGONFLY_HOST: string = env.DRAGONFLY_HOST || '';

    @CheckEnvVariable
    public DRAGONFLY_PORT: number = env.DRAGONFLY_PORT ? parseInt(env.DRAGONFLY_PORT) : 0;
    ////////////////////////

    public static get instance(): EnvironmentConfiguration {
        if (!EnvironmentConfiguration._instance)
            EnvironmentConfiguration._instance = new EnvironmentConfiguration();
        return EnvironmentConfiguration._instance;
    }

    public static get env(): IEnvironment {
        return EnvironmentConfiguration.instance as IEnvironment;
    }
}
