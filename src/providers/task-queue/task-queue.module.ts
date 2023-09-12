import { Module } from "@core/application";
import { TaskQueueService } from "./bull/task-queue.service";

@Module({
    providers: [
        TaskQueueService
    ]
})
export class TaskQueueModule {}