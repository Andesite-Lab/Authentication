import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { ILoginDTO } from '@/Data/DTO';

export const LoginSchema: JSONSchemaType<ILoginDTO> = {
    $id: 'LoginSchema',
    title: 'LoginSchema',
    description: 'Schema for login',
    additionalProperties: false,
    type: 'object',
    required: ['password'],
    properties: {
        username: {
            description: 'Username of the user',
            type: 'string',
            pattern: '^[a-zA-Z0-9]{4,32}$',
        },
        email: {
            description: 'Email of the user',
            type: 'string',
            format: 'email',
        },
        password: {
            description: 'Password of the user',
            type: 'string',
            pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{8,32}$',
        }
    },
    anyOf: [
        {
            required: ['username'],
            properties: {
                username: {
                    description: 'Username of the user',
                    type: 'string',
                    pattern: '^[a-zA-Z0-9]{4,32}$',
                },
            }
        },
        {
            required: ['email'],
            properties: {
                email: {
                    description: 'Email of the user',
                    type: 'string',
                    format: 'email',
                }
            }
        }
    ],
    errorMessage: {
        type: ErrorSchema.TYPE_OBJECT,
        required: {
            password: ErrorSchema.PASSWORD_IS_REQUIRED
        },
        anyOf: ErrorSchema.EMAIL_OR_USERNAME_REQUIRED,
        properties: {
            password: ErrorSchema.PASSWORD_PATTERN,
            email: ErrorSchema.EMAIL_PATTERN,
            username: ErrorSchema.USERNAME_PATTERN
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};
