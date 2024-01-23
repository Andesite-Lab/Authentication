import {
    Matches
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrorValidatorKey } from '@/Common/Error';

@JSONSchema({
    title: 'RoleBody schema',
})
export class RoleBody<T> {
    @Matches(/^[A-Za-z0-9_.-]+$/, {
        message: ErrorValidatorKey.INVALID_ROLE
    })
    @JSONSchema({
        examples: ['admin', 'client', 'professional']
    })
    public role: string | undefined;

    public constructor(body: T) {
        Object.assign(this, body);
    }
}
