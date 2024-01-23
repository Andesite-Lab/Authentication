import { ErrorEntity } from '@/Common/Error';

export enum ErrorValidatorKey {
    USERNAME_MIN_LENGTH = 'USERNAME_MIN_LENGTH',
    USERNAME_MAX_LENGTH = 'USERNAME_MAX_LENGTH',
    USERNAME_PATTERN = 'USERNAME_PATTERN',
    EMAIL_MIN_LENGTH = 'EMAIL_MIN_LENGTH',
    EMAIL_MAX_LENGTH = 'EMAIL_MAX_LENGTH',
    EMAIL_PATTERN_AND_BLACKLIST = 'EMAIL_PATTERN_AND_BLACKLIST',
    PASSWORD_MIN_LENGTH = 'PASSWORD_MIN_LENGTH',
    PASSWORD_MAX_LENGTH = 'PASSWORD_MAX_LENGTH',
    PASSWORD_PATTERN = 'PASSWORD_PATTERN',
    EMAIL_OR_USERNAME_NOT_IN_BODY = 'EMAIL_OR_USERNAME_NOT_IN_BODY',
    PASSWORD_NOT_IN_BODY = 'PASSWORD_NOT_IN_BODY',
    INVALID_ROLE = 'INVALID_ROLE',
    INVALID_PERMISSION = 'INVALID_PERMISSION',
    LIMIT_NOT_A_NUMBER = 'LIMIT_NOT_A_NUMBER',
    OFFSET_NOT_A_NUMBER = 'OFFSET_NOT_A_NUMBER',
    ID_NOT_A_NUMBER = 'ID_NOT_A_NUMBER',
}

const ErrorValidatorKeyCode: { [p: string]: number } = {
    [ErrorValidatorKey.USERNAME_MIN_LENGTH]: 400,
    [ErrorValidatorKey.USERNAME_MAX_LENGTH]: 400,
    [ErrorValidatorKey.USERNAME_PATTERN]: 400,
    [ErrorValidatorKey.EMAIL_MIN_LENGTH]: 400,
    [ErrorValidatorKey.EMAIL_MAX_LENGTH]: 400,
    [ErrorValidatorKey.EMAIL_PATTERN_AND_BLACKLIST]: 400,
    [ErrorValidatorKey.PASSWORD_MIN_LENGTH]: 400,
    [ErrorValidatorKey.PASSWORD_MAX_LENGTH]: 400,
    [ErrorValidatorKey.PASSWORD_PATTERN]: 400,
    [ErrorValidatorKey.EMAIL_OR_USERNAME_NOT_IN_BODY]: 400,
    [ErrorValidatorKey.PASSWORD_NOT_IN_BODY]: 400,
    [ErrorValidatorKey.INVALID_ROLE]: 400,
    [ErrorValidatorKey.INVALID_PERMISSION]: 400,
    [ErrorValidatorKey.LIMIT_NOT_A_NUMBER]: 400,
    [ErrorValidatorKey.OFFSET_NOT_A_NUMBER]: 400,
    [ErrorValidatorKey.ID_NOT_A_NUMBER]: 400,
};

export class ErrorValidator extends ErrorEntity {
    public constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: ErrorValidatorKeyCode[e.key],
            messageKey: `error.errorValidator.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }
}
