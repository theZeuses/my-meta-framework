import { Exception } from "@core/consts";
import { BaseException } from "./BaseException";

export class UnauthorizedException extends BaseException {
    constructor(
        errorCode?: typeof Exception.UnauthorizedException[keyof typeof Exception.UnauthorizedException],
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
            statusCode: 401,
            errorCode: errorCode ?? 40100,
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
