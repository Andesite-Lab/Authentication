import {
    IsAlpha
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrorValidatorKey } from '@/Common/Error';

@JSONSchema({
    title: 'PermissionBody schema',
})
export class PermissionBody<T> {
    @IsAlpha('fr-FR', {
        message: ErrorValidatorKey.INVALID_ROLE
    })
    @JSONSchema({
        examples: ['admin', 'credential', 'credential.read', 'credential.update', 'credential.delete']
    })
    public permission: string | undefined;

    public constructor(body: T) {
        Object.assign(this, body);
    }
}
