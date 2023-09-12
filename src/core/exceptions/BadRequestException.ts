import { Exception } from "@core/consts";
import { BaseException } from "./BaseException";

export class BadRequestException extends BaseException {
    constructor(
        errorCode?: typeof Exception.BadRequestException[keyof typeof Exception.BadRequestException],
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
            statusCode: 400,
            errorCode: errorCode ?? 40000,
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
