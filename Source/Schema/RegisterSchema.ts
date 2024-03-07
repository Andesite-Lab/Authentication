import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { IRegisterDTO } from '@/Data/DTO';

export const RegisterSchema: JSONSchemaType<IRegisterDTO> = {
    $id: 'RegisterSchema',
    title: 'RegisterSchema',
    description: 'Schema for register',
    type: 'object',
    required: ['email', 'username', 'password'],
    additionalProperties: false,
    properties: {
        email: {
            description: 'Email of the user',
            type: 'string',
            format: 'email',
        },
        username: {
            description: 'Username of the user',
            type: 'string',
            pattern: '^[a-zA-Z0-9].{3,32}$',
        },
        password: {
            description: 'Password of the user',
            type: 'string',
            format: 'password',
            pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{4,32}$',
        }
    },
    errorMessage: {
        type: ErrorSchema.TYPE_OBJECT,
        required: {
            enail: ErrorSchema.EMAIL_IS_REQUIRED,
            username: ErrorSchema.USERNAME_IS_REQUIRED,
            password: ErrorSchema.PASSWORD_IS_REQUIRED
        },
        properties: {
            password: ErrorSchema.PASSWORD_PATTERN,
            email: ErrorSchema.EMAIL_PATTERN,
            username: ErrorSchema.USERNAME_PATTERN
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};
