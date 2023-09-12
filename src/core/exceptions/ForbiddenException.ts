import { Exception } from "@core/consts";
import { BaseException } from "./BaseException";

export class ForbiddenException extends BaseException {
    constructor(
        errorCode?: typeof Exception.ForbiddenException[keyof typeof Exception.ForbiddenException],
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
            statusCode: 403,
            errorCode: errorCode ?? 40300,
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
