import { Module } from "@core/application";
import { ReportService } from "./report.service";
import { ReportRepository } from "./report.repository";
import { ReportController } from "./report.controller";
import { AdminGuard, AuthenticateGuard } from "@common/guard";

@Module({
    providers: [
        ReportService,
        ReportRepository,
        AuthenticateGuard,
        AdminGuard
    ],
    controllers: [
        ReportController,
    ]
})
export class ReportModule {}