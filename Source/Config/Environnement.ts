import { env } from 'process';

import { ErrorConfig, ErrorConfigKey } from '@/Common/Error';

function CheckEnvVariable(target: unknown, propertyKey: string): void {
    const value: string | undefined = env[propertyKey];
    if (!value)
        throw new ErrorConfig({
            key: `${propertyKey.toUpperCase()}_NOT_FOUND` as ErrorConfigKey
        });
}

export interface IEnvironment {
    NODE_ENV: string;

    /////// DATABASE ///////
    DB_HOST: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_USER: string;
    ////////////////////////

    //////// GLOBAL ////////
    DOMAIN: string;
    ORIGINS: string[];
    PREFIX: string;
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
    public DB_HOST: string = env.DB_HOST || '';

    @CheckEnvVariable
    public DB_NAME: string = env.DB_NAME || '';

    @CheckEnvVariable
    public DB_PASSWORD: string = env.DB_PASSWORD || '';

    @CheckEnvVariable
    public DB_PORT: number = env.DB_PORT ? parseInt(env.DB_PORT) : 0;

    @CheckEnvVariable
    public DB_USER: string = env.DB_USER || '';
    ////////////////////////

    //////// GLOBAL ////////
    public DOMAIN: string = env.DOMAIN || 'localhost';

    public ORIGINS: string[] = env.ORIGINS ? env.ORIGINS.split(',') : [];

    public PREFIX: string = env.PREFIX || '';
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
