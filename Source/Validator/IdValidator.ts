import {
    IsNumberString
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ErrorValidatorKey } from '@/Common/Error';

@JSONSchema({
    title: 'IdValidator schema',
})
export class IdValidator {
    @IsNumberString({}, {
        message: ErrorValidatorKey.ID_NOT_A_NUMBER
    })
    @JSONSchema({
        examples: ['1', '2', '3', '4', '5']
    })

    public id: string | undefined;

    public constructor(id: string | undefined) {
        this.id = id;
    }
}
