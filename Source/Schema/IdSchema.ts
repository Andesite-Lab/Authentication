import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';

export const IdSchema: JSONSchemaType<{ id: string }> = {
    $id: 'IdSchema',
    title: 'IdSchema',
    description: 'Schema for id',
    additionalProperties: false,
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string',
        }
    },
    errorMessage: {
        type: ErrorSchema.TYPE_OBJECT,
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};