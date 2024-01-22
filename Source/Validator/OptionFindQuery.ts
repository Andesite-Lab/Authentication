import {
    IsNumberString,
    IsOptional
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrorValidatorKey } from '@/Common/Error';

@JSONSchema({
    title: 'OptionFindQuery schema',
})
export class OptionFindQuery<T> {
    @IsNumberString({}, {
        message: ErrorValidatorKey.LIMIT_NOT_A_NUMBER
    })
    @IsOptional()
    public limit: string | undefined;

    @IsNumberString({}, {
        message: ErrorValidatorKey.OFFSET_NOT_A_NUMBER,
    })
    @IsOptional()
    public offset: string | undefined;

    public constructor(body: T) {
        Object.assign(this, body);
    }
}
