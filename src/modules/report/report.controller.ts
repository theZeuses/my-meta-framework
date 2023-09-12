import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuard, ValidateBody, ValidateQuery } from "@core/application";
import { ReportService } from "./report.service";
import { ZodValidationPipe } from "@common/pipe/zod-validation.pipe";
import { CreateReportDto, GetReportQueryDto, PatchReportDto, createReportSchema, getReportQuerySchema, patchReportSchema } from "./dto";
import { AdminGuard, AuthenticateGuard } from "@common/guard";

@Controller("v1/reports")
export class ReportController {
    constructor(
        private readonly reportService: ReportService
    ) { }

    @Get("")
    @UseGuard(AuthenticateGuard)
    @ValidateQuery(new ZodValidationPipe(getReportQuerySchema))
    async getReports(
        @Query() query: GetReportQueryDto
    ) {
        return this.reportService.getMany(query);
    }

    @Get("/:id")
    @UseGuard(AuthenticateGuard)
    async getReport(
        @Param("id") id: string
    ) {
        return this.reportService.findOneById(id);
    }

    @Post("")
    @HttpCode(201)
    @UseGuard(AdminGuard)
    @UseGuard(AuthenticateGuard)
    @ValidateBody(new ZodValidationPipe(createReportSchema))
    async createReport(
        @Body() body: CreateReportDto
    ) {
        return this.reportService.createAndFetchOne(body);
    }

    @Patch("/:id")
    @UseGuard(AdminGuard)
    @UseGuard(AuthenticateGuard)
    @ValidateBody(new ZodValidationPipe(patchReportSchema))
    async updateReport(
        @Param("id") id: string,
        @Body() body: PatchReportDto
    ) {
        return this.reportService.patchAndFetchOneById(id, body);
    }

    @Delete("/:id")
    @UseGuard(AdminGuard)
    @UseGuard(AuthenticateGuard)
    async deleteReport(
        @Param("id") id: string
    ) {
        return this.reportService.fetchAndDeleteOneById(id);
    }
}