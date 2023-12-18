import { ErrorEntity } from '@/Common/Error';

export enum ErrorDragonflyKey {
    DRAGONFLY_CONNECTION_ERROR = 'DRAGONFLY_CONNECTION_ERROR',
    DRAGONFLY_DISCONNECT_ERROR = 'DRAGONFLY_DISCONNECT_ERROR',
    DRAGONFLY_NOT_CONNECTED = 'DRAGONFLY_NOT_CONNECTED',
}

const ErrorDragonflyKeyCode: { [p: string]: number } = {
    DRAGONFLY_CONNECTION_ERROR: 500,
    DRAGONFLY_DISCONNECT_ERROR: 500,
    DRAGONFLY_NOT_CONNECTED: 500,
};

export class ErrorDragonfly extends ErrorEntity {
    constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: ErrorDragonflyKeyCode[e.key],
            messageKey: `error.errorDragonfly.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }
}
