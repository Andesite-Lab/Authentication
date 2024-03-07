import { JSONSchemaType } from 'ajv';

import { ErrorSchema } from '@/Common/Error';
import { IWhereClauseDTO } from '@/Data/DTO';

export const WhereClauseSchema: JSONSchemaType<IWhereClauseDTO> = {
    $id: 'WhereClauseSchema',
    title: 'WhereClauseSchema',
    description: 'Schema for where clause',
    additionalProperties: false,
    type: 'object',
    properties: {
        $in: {
            type: 'array',
            items: {
                type: 'string'
            },
            minItems: 1
        },
        $nin: {
            type: 'array',
            items: {
                type: 'string'
            },
            minItems: 1
        },
        $eq: {
            anyOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' }
            ]
        },
        $neq: {
            anyOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' }
            ]
        },
        $match: {
            type: 'string'
        },
        $lt: {
            anyOf: [
                { type: 'string' },
                { type: 'number' }
            ]
        },
        $lte: {
            anyOf: [
                { type: 'string' },
                { type: 'number' }
            ]
        },
        $gt: {
            anyOf: [
                { type: 'string' },
                { type: 'number' }
            ]
        },
        $gte: {
            anyOf: [
                { type: 'string' },
                { type: 'number' }
            ]
        }
    },
    required: [],
    errorMessage: {
        type: ErrorSchema.TYPE_OBJECT,
        properties: {
            $in: ErrorSchema.$IN_ARRAY_PATTERN,
            $nin: ErrorSchema.$NIN_ARRAY_PATTERN,
            $eq: ErrorSchema.$EQ_PATTERN,
            $neq: ErrorSchema.$NEQ_PATTERN,
            $match: ErrorSchema.$MATCH_PATTERN,
            $lt: ErrorSchema.$LT_PATTERN,
            $lte: ErrorSchema.$LTE_PATTERN,
            $gt: ErrorSchema.$GT_PATTERN
        },
        additionalProperties: ErrorSchema.ADDITIONAL_PROPERTIES,
        _: ErrorSchema.NO_BODY
    }
};