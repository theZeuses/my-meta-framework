import { Module } from "@core/application";
import { EmailVerifierJobConsumer } from "./email-verifier.consumer";
import { VerifyEmailNotification } from "@src/notification/verify-email/verify-email.notification";

@Module({
    providers: [
        EmailVerifierJobConsumer,
        VerifyEmailNotification
    ]
})
export class EmailVerifierJobConsumerModule {}