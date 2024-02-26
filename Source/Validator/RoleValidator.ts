import {
    IsDate,
    IsInt,
    // IsDefined
    IsOptional,
    Matches
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrorValidatorKey } from '@/Common/Error';

@JSONSchema({
    title: 'RoleValidator schema',
})
export class RoleValidator<T> {
    @Matches(/^[A-Za-z0-9_.-]+$/, {
        message: ErrorValidatorKey.INVALID_ROLE
    })
    @JSONSchema({
        examples: ['admin', 'client', 'professional']
    })
    @IsOptional()
    public role: string | undefined;

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
