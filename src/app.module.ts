import { Module } from "@core/application";
import { TaskJobConsumerModule } from "@jobs/consumers/consumer.module";
import { AuthModule } from "@modules/auth/auth.module";
import { ReportModule } from "@modules/report/report.module";
import { UserModule } from "@modules/user/user.module";
import { DatabaseModule } from "@providers/database/database.module";
import { MemoryStoreModule } from "@providers/memory-store/memory-store.module";
import { TaskQueueModule } from "@providers/task-queue/task-queue.module";

@Module({
    imports: [
        AuthModule,
        UserModule,
        ReportModule,
        DatabaseModule,
        MemoryStoreModule,
        TaskQueueModule,
        TaskJobConsumerModule
    ]
})
export class AppModule {}