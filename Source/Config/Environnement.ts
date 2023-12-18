import * as process from 'process';

import { ErrorConfig, ErrorConfigKey } from '@/Common/Error';

function CheckEnvVariable(target: unknown, propertyKey: string): void {
    const value: string | undefined = process.env[propertyKey];
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
    COOKIE_SECRET: string;
    HOST: string;
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

    @CheckEnvVariable
    public NODE_ENV: string = process.env.NODE_ENV || '';

    /////// DATABASE ///////
    @CheckEnvVariable
    public DB_HOST: string = process.env.DB_HOST || '';

    @CheckEnvVariable
    public DB_NAME: string = process.env.DB_NAME || '';

    @CheckEnvVariable
    public DB_PASSWORD: string = process.env.DB_PASSWORD || '';

    @CheckEnvVariable
    public DB_PORT: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 0;

    @CheckEnvVariable
    public DB_USER: string = process.env.DB_USER || '';
    ////////////////////////

    //////// GLOBAL ////////
    @CheckEnvVariable
    public COOKIE_SECRET: string = process.env.COOKIE_SECRET || '';

    @CheckEnvVariable
    public HOST: string = process.env.HOST || '';

    public ORIGINS: string[] = process.env.ORIGINS ? process.env.ORIGINS.split(',') : [];

    public PREFIX: string = process.env.PREFIX || '';
    ////////////////////////

    //////// HTTP //////////
    @CheckEnvVariable
    public HTTP_PORT: number = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 0;

    ////////////////////////

    //////// REDPANDA //////
    @CheckEnvVariable
    public RED_PANDA_BROKERS: string[] = process.env.RED_PANDA_BROKERS ? process.env.RED_PANDA_BROKERS.split(',') : [];
    ////////////////////////

    ////////// WS //////////
    @CheckEnvVariable
    public WS_PORT: number = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 0;
    ////////////////////////

    ////// DRAGONFLY ///////
    @CheckEnvVariable
    public DRAGONFLY_HOST: string = process.env.DRAGONFLY_HOST || '';

    @CheckEnvVariable
    public DRAGONFLY_PORT: number = process.env.DRAGONFLY_PORT ? parseInt(process.env.DRAGONFLY_PORT) : 0;
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
