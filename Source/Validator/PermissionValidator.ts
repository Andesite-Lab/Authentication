import {
    Matches
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
    @JSONSchema({
        examples: ['admin', 'credential', 'credential.read', 'credential.update', 'credential.delete']
    })
    public permission: string | undefined;

    public constructor(body: T) {
        Object.assign(this, body);
    }
}
