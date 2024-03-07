import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { IRoleDTO } from '@/Data/DTO/Model/StaticDB/authentication';

export const RoleSchema: JSONSchemaType<Pick<IRoleDTO, 'role'> | Pick<IRoleDTO, 'role'>[]> = {
    $id: 'RoleSchema',
    title: 'RoleSchema',
    description: 'Schema for role',
    type: ['object', 'array'],
    additionalProperties: false,
    required: [],
    oneOf: [
        {
            type: 'object',
            additionalProperties: false,
            required: [],
            properties: {
                role: {
                    type: 'string',
                    description: 'Name of the role',
                    pattern: '^[a-zA-Z0-9].{3,16}$',
                }
            },
        },
        {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: [],
                properties: {
                    role: {
                        description: 'Name of the role',
                        type: 'string',
                        pattern: '^[a-zA-Z0-9].{3,16}$',
                    }
                },
            }
        }
    ],
    errorMessage: {
        oneOf: ErrorSchema.MUST_BE_ARRAY_OR_OBJECT,
        type: ErrorSchema.TYPE_OBJECT,
        properties: {
            role: ErrorSchema.ROLE_PATTERN,
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};