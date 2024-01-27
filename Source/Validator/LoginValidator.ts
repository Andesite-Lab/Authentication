import {
    registerDecorator,
    // IsEmpty,
    ValidationOptions
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { faker } from '@faker-js/faker';

import { ErrorValidatorKey } from '@/Common/Error';

interface EmailOrUsername {
    email?: string;
    username?: string;
}

function HasEmailOrUsername(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'HasEmailOrUsername',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: unknown): boolean {
                    if (typeof value !== 'object')
                        return false;
                    const object: EmailOrUsername = value as EmailOrUsername;
                    return !!((object.email) || (object.username));
                },
            },
        });
    };
}

@JSONSchema({
    title: 'LoginValidator schema',
})
export class LoginValidator {
    @HasEmailOrUsername({
        message: ErrorValidatorKey.EMAIL_OR_USERNAME_REQUIRED
    })
    @JSONSchema({
        description: 'Email or username',
        type: 'string',
        examples: [faker.internet.email(), faker.string.alphanumeric({ length: 16 })],
    })
    public usernameOrEmail: EmailOrUsername;

    // @IsEmpty({
    //     message: ErrorValidatorKey.PASSWORD_IS_REQUIRED
    // })
    @JSONSchema({
        type: 'string',
        minLength: 6,
        maxLength: 32,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])',
        examples: [() : string => faker.internet.password({
            length: 16,
            pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/ //
        })],
    })
    public password: string | undefined;

    public constructor(body: {
        username?: string,
        email?: string,
        password?: string
    }) {
        this.usernameOrEmail = {
            username: body.username,
            email: body.email,
        };
        this.password = body.password;
    }
}
