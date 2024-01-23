import { ErrorEntity } from '@/Common/Error';

export enum ErrorUseCaseKey {
    PASSWORD_NOT_VALID = 'PASSWORD_NOT_VALID',
}

const ErrorUseCaseKeyCode: { [p: string]: number } = {
    [ErrorUseCaseKey.PASSWORD_NOT_VALID]: 400,
};

export class ErrorUseCase extends ErrorEntity {
    public constructor(e: {
        key: string,
        detail?: unknown,
        interpolation?: { [key: string]: unknown }
    }) {
        super({
            code: ErrorUseCaseKeyCode[e.key],
            messageKey: `error.errorUseCase.${e.key}`,
            detail: e.detail,
            interpolation: e.interpolation,
        });
    }
}
