import { randomUUID } from 'crypto';

/**
 * ErrorEntity is a class that represents an error entity with a unique identifier.
 */
export class ErrorEntity extends Error {
    /**
     * The unique identifier of the error.
     * This identifier is used to track the error in the logs.
     */
    private readonly _uuidError: string = randomUUID();
    /**
     * The name of the error entity.
     */
    private readonly _name: string;
    /**
     * The error code.
     */
    private readonly _code: number;
    /**
     * The error interpolation.
     */
    private readonly _interpolation: { [key: string]: unknown } | undefined;
    /**
     * The error detail.
     */
    private readonly _detail?: unknown;

    /**
     * Create a new instance of ErrorEntity.
     * 
     * @param error The error object. (code, messageKey, detail, interpolation)
     */
    public constructor(error: {
        code: number,
        messageKey: string,
        detail?: unknown
        interpolation: { [key: string]: unknown } | undefined
    }) {
        super();
        this.message = error.messageKey;
        this._name = this.constructor.name;
        this._code = error.code;
        this._detail = error.detail;
        this._interpolation = error.interpolation;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Gets the error code.
     * @returns The error code.
     */
    public get code(): number {
        return this._code;
    }

    /**
     * Gets the error name.
     * @returns The error name.
     */
    public override get name(): string {
        return this._name;
    }

    /**
     * Gets the error detail.
     * @returns The error detail.
     */
    public get detail(): unknown {
        return this._detail;
    }

    /**
     * Gets the unique identifier of the error.
     * @returns The unique identifier of the error.
     */
    public get uuidError(): string {
        return this._uuidError;
    }

    /**
     * Gets the error interpolation.
     * @returns The error interpolation.
     */
    public get interpolation(): { [key: string]: unknown } | undefined {
        return this._interpolation;
    }
}
