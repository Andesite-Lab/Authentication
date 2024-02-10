import { ErrorEntity } from '@/Common/Error';

export enum ErrorConfigKey {
    DB_HOST_NOT_FOUND = 'DB_HOST_NOT_FOUND',
    DB_NAME_NOT_FOUND = 'DB_NAME_NOT_FOUND',
    DB_PASSWORD_NOT_FOUND = 'DB_PASSWORD_NOT_FOUND',
    DB_USER_NOT_FOUND = 'DB_USER_NOT_FOUND',
    DB_PORT_NOT_FOUND = 'DB_PORT_NOT_FOUND',

    HTTP_PORT_NOT_FOUND = 'HTTP_PORT_NOT_FOUND',
    WS_PORT_NOT_FOUND = 'WS_PORT_NOT_FOUND',

    RED_PANDA_BROKER_NOT_FOUND = 'RED_PANDA_BROKER_NOT_FOUND',

    DRAGONFLY_HOST_NOT_FOUND = 'DRAGONFLY_HOST_NOT_FOUND',
    DRAGONFLY_PORT_NOT_FOUND = 'DRAGONFLY_PORT_NOT_FOUND',
}

export class ErrorConfig extends ErrorEntity {
    public constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: 500,
            messageKey: `error.errorConfig.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }

}
