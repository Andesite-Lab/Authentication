import { ErrorEntity } from './ErrorEntity';

export enum ErrorMiddlewareKey {
    CREDENTIAL_BLACKLISTED = 'CREDENTIAL_BLACKLISTED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    TOKEN_INVALID_STRUCTURE= 'TOKEN_INVALID_STRUCTURE',
    TOKEN_INVALID_SIGNATURE = 'TOKEN_INVALID_SIGNATURE',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_NO_FOUND = 'TOKEN_NO_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
}

const ErrorMiddlewareKeyCode: { [p: string]: number } = {
    CREDENTIAL_BLACKLISTED: 403,
    TOKEN_INVALID: 401,
    TOKEN_INVALID_STRUCTURE: 401,
    TOKEN_INVALID_SIGNATURE: 401,
    TOKEN_EXPIRED: 401,
    TOKEN_NO_FOUND: 401,
    PERMISSION_DENIED: 403,
};

export class ErrorMiddleware extends ErrorEntity {
    public constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: ErrorMiddlewareKeyCode[e.key] || 400,
            messageKey: `error.errorMiddleware.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }
}
