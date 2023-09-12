import { Exception } from "@core/consts";
import { ForbiddenException, InternalServerErrorException } from "@core/exceptions";
import { VerificationCodeDocument } from "../schema";

export class VerificationCodifyService {
    /**
     * Generate a otp of numeric characters
     */
    generateOTP(length: number) {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < length; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    /**
     * Checks whether the code has expired or not
     * @throws { ForbiddenException }
     */
    verifyCodeExpiry(verificationCode: VerificationCodeDocument) {
        if (!verificationCode.expires_at) throw new InternalServerErrorException();

        if (new Date(verificationCode.expires_at) < new Date()) {
            throw new ForbiddenException(Exception.ForbiddenException.CODE_EXPIRED);
        }
    }

    /**
     * Checks whether the code has passed maximum try attempts or not
     * @throws { ForbiddenException }
     */
    verifyCodeAttempts(verificationCode: VerificationCodeDocument, maximum_retry_limit: number) {
        if (verificationCode.attempts >= maximum_retry_limit) {
            throw new ForbiddenException(Exception.ForbiddenException.CODE_MAXIMUM_RETRY_LIMIT_REACHED);
        }
    }
}