import { Exception } from "@core/consts";
import { BaseException } from "./BaseException";

export class NotFoundException extends BaseException {
    constructor(
        errorCode?: typeof Exception.NotFoundException[keyof typeof Exception.NotFoundException],
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
            statusCode: 404,
            errorCode: errorCode ?? 40400,
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
