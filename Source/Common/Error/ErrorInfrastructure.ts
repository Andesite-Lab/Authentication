import { ErrorEntity } from './ErrorEntity';

export enum ErrorInfrastructureKey {
    DRAGONFLY_CONNECTION_ERROR = 'DRAGONFLY_CONNECTION_ERROR',
    DRAGONFLY_DISCONNECT_ERROR = 'DRAGONFLY_DISCONNECT_ERROR',
    DRAGONFLY_NOT_CONNECTED = 'DRAGONFLY_NOT_CONNECTED',

    DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
    DATABASE_DISCONNECT_ERROR = 'DATABASE_DISCONNECT_ERROR',
    DATABASE_MODEL_NOT_CREATED = 'DATABASE_MODEL_NOT_CREATED',
    DATABASE_MODEL_UNIQUE_CONSTRAINT_ERROR = 'DATABASE_MODEL_UNIQUE_CONSTRAINT_ERROR',
    DATABASE_MODEL_NOT_FOUND = 'DATABASE_MODEL_NOT_FOUND',
    DATABASE_MODEL_NOT_UPDATED = 'DATABASE_MODEL_NOT_UPDATED',
    DATABASE_MODEL_NOT_DELETED = 'DATABASE_MODEL_NOT_DELETED',
    DATABASE_OTHER_DATABASE_ERROR = 'DATABASE_OTHER_DATABASE_ERROR',
    DATABASE_NOT_CONNECTED = 'DATABASE_NOT_CONNECTED',

    RED_PANDA_PRODUCER_CONNECTION_ERROR = 'RED_PANDA_PRODUCER_CONNECTION_ERROR',
    RED_PANDA_PRODUCER_IS_NOT_CONNECTED = 'RED_PANDA_PRODUCER_IS_NOT_CONNECTED',
    RED_PANDA_PRODUCER_DISCONNECT_ERROR = 'RED_PANDA_PRODUCER_DISCONNECT_ERROR',
    RED_PANDA_PRODUCER_SEND_ERROR = 'RED_PANDA_PRODUCER_SEND_ERROR',
    RED_PANDA_CONSUMER_CONNECTION_ERROR = 'RED_PANDA_CONSUMER_CONNECTION_ERROR',
    RED_PANDA_CONSUMER_IS_NOT_CONNECTED = 'RED_PANDA_CONSUMER_IS_NOT_CONNECTED',
    RED_PANDA_CONSUMER_SUBSCRIBE_ERROR = 'RED_PANDA_CONSUMER_SUBSCRIBE_ERROR',
    RED_PANDA_CONSUMER_DISCONNECT_ERROR = 'RED_PANDA_CONSUMER_DISCONNECT_ERROR',
}

export class ErrorInfrastructure extends ErrorEntity {
    public constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: 500,
            messageKey: `error.errorInfrastructure.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }
}
