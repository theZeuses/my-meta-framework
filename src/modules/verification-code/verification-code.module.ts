import { Module } from "@core/application";
import { VerificationCodeRepository } from "./verification-code.repository";
import { VerificationCodeService } from "./verification-code.service";
import { VerificationCodifyService } from "./service";

@Module({
    providers: [
        VerificationCodeRepository,
        VerificationCodeService,
        VerificationCodifyService
    ]
})
export class VerificationCodeModule {}