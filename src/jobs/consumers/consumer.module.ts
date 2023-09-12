import { Module } from "@core/application";
import { EmailVerifierJobConsumerModule } from "./emailVerifier/email-verifier.module";

@Module({
    imports: [
        EmailVerifierJobConsumerModule
    ]
})
export class TaskJobConsumerModule {}