import { JSONSchema } from 'class-validator-jsonschema';
import { faker } from '@faker-js/faker';
import {
    MinLength,
    IsEmail,
    IsStrongPassword,
    MaxLength,
    Matches,
    IsDefined
} from 'class-validator';

import { ErrorValidatorKey } from '@/Common/Error';
import mailBlacklist from './mailBlacklist.json';

@JSONSchema({
    title: 'RegisterValidator schema',
    examples: [
        { email: faker.internet.email(), password: faker.internet.password(), username: faker.string.alphanumeric({ length: 16 }) },
        {
            email: faker.internet.email(),
            password: faker.internet.password(),
            username: faker.string.alphanumeric({ length: 16 }),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode(),
            city: faker.location.city(),
            address: faker.location.streetAddress(),
        },
    ],
    required: ['email', 'password', 'username'],
})
export class RegisterValidator<T> {
    @IsDefined({
        message: ErrorValidatorKey.USERNAME_IS_REQUIRED
    })
    @MinLength(4, {
        always: true,
        message: ErrorValidatorKey.USERNAME_MIN_LENGTH
    })
    @MaxLength(20, {
        always: true,
        message: ErrorValidatorKey.USERNAME_MAX_LENGTH

    })
    @Matches(/^[a-zA-Z0-9_-]*$/, {
        message: ErrorValidatorKey.USERNAME_PATTERN
    })
    @JSONSchema({
        type: 'string',
        pattern: '^[a-zA-Z0-9]*$',
        examples: [faker.string.alphanumeric({ length: 16 })],
    })
    public username: string | undefined;

    @IsDefined({
        message: ErrorValidatorKey.EMAIL_IS_REQUIRED
    })
    @MaxLength(255, {
        always: true,
        message: ErrorValidatorKey.EMAIL_MAX_LENGTH
    })
    @MinLength(10, {
        always: true,
        message: ErrorValidatorKey.EMAIL_MIN_LENGTH
    })
    @IsEmail({
        domain_specific_validation: true,
        host_blacklist: mailBlacklist,
    }, {
        always: true,
        message: ErrorValidatorKey.EMAIL_PATTERN_AND_BLACKLIST
    })
    @JSONSchema({
        type: 'string',
        examples: [faker.internet.email()],
    })
    public email: string | undefined;

    @IsDefined({
        message: ErrorValidatorKey.PASSWORD_IS_REQUIRED
    })
    @MaxLength(32, {
        always: true,
        message: ErrorValidatorKey.PASSWORD_MAX_LENGTH
    })
    @MinLength(8, {
        always: true,
        message: ErrorValidatorKey.PASSWORD_MIN_LENGTH
    })
    @IsStrongPassword(
        {
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }
        , {
            always: true,
            message: ErrorValidatorKey.PASSWORD_PATTERN
        })
    @JSONSchema({
        type: 'string',
        minLength: 8,
        maxLength: 32,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])',
        examples: [() : string => faker.internet.password({
            length: 16,
            pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/ //
        })],
    })
    public password: string | undefined;

    public constructor(body: T) {
        Object.assign(this, body);
    }
}
