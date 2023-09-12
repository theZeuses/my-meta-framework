import { JOB_NAME } from "@common/constants/jobs.constant";
import { Injectable } from "@core/application";
import { Producer } from "@core/task-queue";
import { IEmailVerifierJobData } from "@jobs/interface/job-data.interface";
import { TaskQueueService } from "@providers/task-queue/bull";

@Injectable()
export class EmailVerifierJobProducer extends Producer<IEmailVerifierJobData> {
    constructor(
        queueService: TaskQueueService,
    ) {
        super(queueService.getQueue("EMAIL_VERIFICATION_EMAIL"), JOB_NAME.EMAIL_VERIFIER.SEND, {
            removeOnComplete: true
        })
    }
}