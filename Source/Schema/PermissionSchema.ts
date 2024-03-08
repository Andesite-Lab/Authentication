import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { IPermissionDTO } from '@/Data/DTO/Model/StaticDB/authentication';

export const PermissionSchema: JSONSchemaType<Pick<IPermissionDTO, 'permission'> | Pick<IPermissionDTO, 'permission'>[]> = {
    $id: 'PermissionSchema',
    title: 'PermissionSchema',
    description: 'Schema for Permission',
    type: ['object', 'array'],
    additionalProperties: false,
    required: [],
    oneOf: [
        {
            type: 'object',
            additionalProperties: false,
            required: [],
            properties: {
                permission: {
                    type: 'string',
                    description: 'Name of the permission',
                    pattern: '^[a-zA-Z0-9].{3,32}$',
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
                    permission: {
                        description: 'Name of the permission',
                        type: 'string',
                        pattern: '^[a-zA-Z0-9].{3,32}$',
                    }
                },
            }
        }
    ],
    errorMessage: {
        oneOf: ErrorSchema.MUST_BE_ARRAY_OR_OBJECT,
        type: ErrorSchema.TYPE_OBJECT,
        properties: {
            permission: ErrorSchema.PERMISSION_PATTERN,
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};