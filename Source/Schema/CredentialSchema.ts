import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { ICrendentialDTO } from '@/Data/DTO/Model/StaticDB/authentication';

export const CredentialSchema: JSONSchemaType<Omit<ICrendentialDTO, 'blacklisted' | 'uuid'>> = {
    $id: 'CredentialValidatorSchema',
    title: 'CredentialValidatorSchema',
    description: 'Schema for credential validator',
    additionalProperties: false,
    type: 'object',
    required: [],
    properties: {
        email: {
            description: 'Email of the user',
            type: 'string',
            format: 'email',
        },
        username: {
            description: 'Username of the user',
            type: 'string',
            pattern: '^[a-zA-Z0-9]{4,32}$',
        },
        password: {
            description: 'Password of the user',
            type: 'string',
            format: 'password',
            pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{8,32}$',
        }
    },
    errorMessage: {
        type: ErrorSchema.TYPE_OBJECT,
        properties: {
            password: ErrorSchema.PASSWORD_PATTERN,
            email: ErrorSchema.EMAIL_PATTERN,
            username: ErrorSchema.USERNAME_PATTERN
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};