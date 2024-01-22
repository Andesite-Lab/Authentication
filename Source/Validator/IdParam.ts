import { ErrorValidatorKey } from '@/Common/Error';

import {
    IsNumberString
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({
    title: 'IdParam schema',
})
export class IdParam {
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
