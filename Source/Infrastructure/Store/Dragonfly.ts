import Redis from 'ioredis';
import { BasaltLogger } from '@basalt-lab/basalt-logger';

import { EnvironmentConfiguration, I18n, Language } from '@/Config';
import { ErrorDragonfly, ErrorDragonflyKey } from '@/Common/Error';

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
            throw new ErrorDragonfly({
                key: ErrorDragonflyKey.DRAGONFLY_NOT_CONNECTED
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
            throw new ErrorDragonfly({
                key: ErrorDragonflyKey.DRAGONFLY_CONNECTION_ERROR,
                detail: error
            });
        }
    }

    public disconnect(): void {
        try {
            this._redis?.disconnect();
            BasaltLogger.log(I18n.translate('infrastructure.dragonfly.disconnected', Language.EN));
        } catch (error) {
            throw new ErrorDragonfly({
                key: ErrorDragonflyKey.DRAGONFLY_DISCONNECT_ERROR,
                detail: error
            });
        }
    }
}
