import { ErrorEntity } from '@/Common/Error';


export enum ErrorInfrastructureKey {
    RED_PANDA_PRODUCER_CONNECTION_ERROR = 'RED_PANDA_PRODUCER_CONNECTION_ERROR',
    RED_PANDA_PRODUCER_IS_NOT_CONNECTED = 'RED_PANDA_PRODUCER_IS_NOT_CONNECTED',
    RED_PANDA_PRODUCER_DISCONNECT_ERROR = 'RED_PANDA_PRODUCER_DISCONNECT_ERROR',
    RED_PANDA_PRODUCER_SEND_ERROR = 'RED_PANDA_PRODUCER_SEND_ERROR',
    RED_PANDA_CONSUMER_CONNECTION_ERROR = 'RED_PANDA_CONSUMER_CONNECTION_ERROR',
    RED_PANDA_CONSUMER_IS_NOT_CONNECTED = 'RED_PANDA_CONSUMER_IS_NOT_CONNECTED',
    RED_PANDA_CONSUMER_SUBSCRIBE_ERROR = 'RED_PANDA_CONSUMER_SUBSCRIBE_ERROR',
    RED_PANDA_CONSUMER_DISCONNECT_ERROR = 'RED_PANDA_CONSUMER_DISCONNECT_ERROR',
}

const ErrorInfrastructureKeyCode: { [p: string]: number } = {
    [ErrorInfrastructureKey.RED_PANDA_PRODUCER_CONNECTION_ERROR]: 500,
    [ErrorInfrastructureKey.RED_PANDA_PRODUCER_IS_NOT_CONNECTED]: 500,
    [ErrorInfrastructureKey.RED_PANDA_PRODUCER_DISCONNECT_ERROR]: 500,
    [ErrorInfrastructureKey.RED_PANDA_PRODUCER_SEND_ERROR]: 500,
    [ErrorInfrastructureKey.RED_PANDA_CONSUMER_CONNECTION_ERROR]: 500,
    [ErrorInfrastructureKey.RED_PANDA_CONSUMER_IS_NOT_CONNECTED]: 500,
    [ErrorInfrastructureKey.RED_PANDA_CONSUMER_SUBSCRIBE_ERROR]: 500,
    [ErrorInfrastructureKey.RED_PANDA_CONSUMER_DISCONNECT_ERROR]: 500,
};

export class ErrorInfrastructure extends ErrorEntity {
    public constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: ErrorInfrastructureKeyCode[e.key],
            messageKey: `error.errorInfrastructure.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }
}
