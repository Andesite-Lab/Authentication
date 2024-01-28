import {
    Matches,
    IsDefined,
    IsDate,
    IsOptional,
    IsInt
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrorValidatorKey } from '@/Common/Error';

@JSONSchema({
    title: 'PermissionValidator schema',
})
export class PermissionValidator<T> {
    @Matches(/^[A-Za-z0-9_.-]+$/, {
        message: ErrorValidatorKey.INVALID_PERMISSION
    })
    @IsDefined({
        message: ErrorValidatorKey.PERMISSION_IS_REQUIRED
    })
    @JSONSchema({
        examples: ['admin', 'credential', 'credential.read', 'credential.update', 'credential.delete']
    })
    public permission: string | undefined;

    @IsDate({
        message: ErrorValidatorKey.INVALID_DATE
    })
    @IsOptional()
    public createdAt: Date | undefined;

    @IsDate({
        message: ErrorValidatorKey.INVALID_DATE
    })
    @IsOptional()
    public updatedAt: Date | undefined;

    @IsInt({
        message: ErrorValidatorKey.ID_NOT_A_INTEGER
    })
    @IsOptional()
    public id: number | undefined;

    public constructor(body: T) {
        Object.assign(this, body);
    }
}
