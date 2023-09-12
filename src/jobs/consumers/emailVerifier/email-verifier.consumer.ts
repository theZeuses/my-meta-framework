import { JOB_NAME } from "@common/constants/jobs.constant";
import { Injectable } from "@core/application";
import { Consumer } from "@core/task-queue";
import { IEmailVerifierJobData } from "@jobs/interface/job-data.interface";
import { TaskQueueService } from "@providers/task-queue/bull";
import { VerifyEmailNotification } from "@src/notification/verify-email/verify-email.notification";

@Injectable()
export class EmailVerifierJobConsumer extends Consumer<IEmailVerifierJobData> {
    
    constructor(
        queueService: TaskQueueService,
        private readonly notification: VerifyEmailNotification
    ) {
        super(queueService.getQueue("EMAIL_VERIFICATION_EMAIL"), JOB_NAME.EMAIL_VERIFIER.SEND);
        this.notification = new VerifyEmailNotification();
    }

    async consumer(data: IEmailVerifierJobData): Promise<any> {
        await this.notification.mail({
            email: data.email,
            payload: data
        })
    }
}