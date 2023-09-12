import { Exception } from "@core/consts";
import { BaseException } from "./BaseException";

export class InternalServerErrorException extends BaseException {
    constructor(
        errorCode?: typeof Exception.InternalServerErrorException[keyof typeof Exception.InternalServerErrorException],
        payload?: {
            reference?: any,
            errors?: any
        },
        loggerOptions?: {
            type?: string,
            errSource?: string,
            rawError?: any,
            additionalData?: any
        }
    ) {
        super({
            statusCode: 500,
            errorCode: errorCode ?? 50000,
            reference: payload?.reference,
            errors: payload?.errors
                ? Array.isArray(payload.errors)
                    ? payload.errors
                    : [payload.errors]
                : undefined,
            loggerOptions
        });
    }
}
