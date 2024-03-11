import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { IPaginationOptionDTO } from '@/Data/DTO';

export const PaginationOptionSchema: JSONSchemaType<IPaginationOptionDTO> = {
    $id: 'PaginationOptionsSchema',
    title: 'PaginationOptionsSchema',
    description: 'Schema for pagination options',
    additionalProperties: false,
    type: 'object',
    properties: {
        limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            default: 25,
        },
        offset: {
            type: 'integer',
            minimum: 0,
            default: 0,
        }
    },
    required: [],
    errorMessage: {
        type: ErrorSchema.TYPE_OBJECT,
        properties: {
            limit: ErrorSchema.LIMIT_PATTERN,
            offset: ErrorSchema.OFFSET_PATTERN
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};