import { Exception } from "@core/consts";
import { ForbiddenException } from "@core/exceptions";
import { VerificationCodeService } from "@modules/verification-code/verification-code.service";
import { UserService } from "@modules/user/user.service";
import { Injectable } from "@core/application";
import { VerificationifyService } from "./service/verificationify.service";
import { EmailVerifierJobProducer } from "@jobs/producers";


@Injectable()
export class VerificationService {
    constructor(
        private readonly emailVerifierJobProducer: EmailVerifierJobProducer,
        private readonly verificationCodeService: VerificationCodeService,
        private readonly userService: UserService,
        private readonly verificationifyService: VerificationifyService
    ) { }

    async sendEmailVerificationMail(email: string) {
        const user = await this.verificationifyService.checkAndGetUserByEmail(email);

        this.verificationifyService.checkEmailVerificationStatus(user);

        return this.enqueueEmailVerificationMail(email, user._id);
    }

    /**
     * Enqueues EmailVerificationMail sender job to the task queue
     */
    async enqueueEmailVerificationMail(email: string, u_id: string) {
        const result = await this.verificationCodeService.createOneForEmailVerification(email, u_id);

        await this.emailVerifierJobProducer.produce({
            email,
            code: result.code
        });

        return result.verificationCode;
    }

    /**
     * Tries to verify the user and the verification code
     * If the request is valid then set the email_verified_at filed of user and saves to database
     * @throws { ForbiddenException }
     */
    async verifyEmail(id: string, code: string) {
        const result = await this.verificationCodeService.verifyOne(id, code);

        if (result.type != "EMAIL_VERIFICATION" || !result.reference_id) throw new ForbiddenException();

        const user = await this.userService.getOneById(result.reference_id);

        if (!user) {
            throw new ForbiddenException(Exception.ForbiddenException.NOT_FOUND);
        }

        this.verificationifyService.checkEmailVerificationStatus(user);

        if (user.email == result.medium) {
            await this.userService.patchOneById(
                result.reference_id,
                {
                    email_verified_at: new Date(),
                }
            );

            return {
                user
            }
        }

        throw new ForbiddenException();
    }
}