import { Exception } from "@core/consts";
import { BaseException } from "./BaseException";

export class UnprocessableEntityException extends BaseException {
    constructor(
        errorCode?: typeof Exception.UnprocessableEntityException[keyof typeof Exception.UnprocessableEntityException],
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
            statusCode: 422,
            errorCode: errorCode ?? 42200,
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
