import { BasaltLogger } from '@basalt-lab/basalt-logger';
import Redis from 'ioredis';

import { ErrorInfrastructure, ErrorInfrastructureKey } from '@/Common/Error';
import { EnvironmentConfiguration, I18n, Language } from '@/Config';

export class Dragonfly {
    private static _instance: Dragonfly;
    private _redis: Redis | undefined;

    public static get instance(): Dragonfly {
        if (!Dragonfly._instance)
            Dragonfly._instance = new Dragonfly();
        return Dragonfly._instance;
    }

    public get redis(): Redis {
        if (!this._redis)
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DRAGONFLY_NOT_CONNECTED
            });
        return this._redis;
    }

    public connect(): void {
        try {
            this._redis = new Redis({
                host: EnvironmentConfiguration.env.DRAGONFLY_HOST,
                port: EnvironmentConfiguration.env.DRAGONFLY_PORT,

            });
            BasaltLogger.log(I18n.translate('infrastructure.dragonfly.connected', Language.EN));
        } catch (error) {
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DRAGONFLY_CONNECTION_ERROR,
                detail: error
            });
        }
    }

    public disconnect(): void {
        try {
            this._redis?.disconnect();
            BasaltLogger.log(I18n.translate('infrastructure.dragonfly.disconnected', Language.EN));
        } catch (error) {
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.DRAGONFLY_DISCONNECT_ERROR,
                detail: error
            });
        }
    }
}
