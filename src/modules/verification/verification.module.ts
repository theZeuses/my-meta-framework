import { Module } from "@core/application";
import { VerificationCodeModule } from "@modules/verification-code/verification-code.module";
import { VerificationService } from "./verification.service";
import { VerificationifyService } from "./service";

@Module({
    imports: [
        VerificationCodeModule
    ],
    providers: [
        VerificationService,
        VerificationifyService
    ]
})
export class VerificationModule {}