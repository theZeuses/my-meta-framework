import { Injectable } from "@core/application";
import { ReportRepository } from "./report.repository";
import { CreateReportDto, PatchReportDto } from "./dto";
import { NotFoundException } from "@core/exceptions";
import { Exception } from "@core/consts";
import { validateObjectId } from "@core/mongo";

@Injectable()
export class ReportService {
    constructor(
        private readonly reportRepository: ReportRepository
    ) { }

    async getMany(options?: {
        limit: number,
        skip: number
    }) {
        return this.reportRepository.query().find({}, {}, {
            ...options
        })
    }

    /**
     * Finds a Report by id. Throws an error if not found
     * @throws { NotFoundException }
     */
    async findOneById(id: string) {
        validateObjectId(id);

        const report = await this.reportRepository.query().findById(id);

        if (!report) throw new NotFoundException(Exception.NotFoundException.ENTITY_NOT_FOUND);

        return report;
    }

    async createAndFetchOne(dto: CreateReportDto) {
        return this.reportRepository.query().create(dto);
    }

    /**
     * Tries to patch a report using the provided properties and values. 
     * Throws an error if report not found by the id
     * @throws { NotFoundException }
     */
    async patchAndFetchOneById(id: string, dto: PatchReportDto) {
        const report = await this.findOneById(id);

        return this.reportRepository.query().findByIdAndUpdate(id, {
            ...dto
        }, {
            returnDocument: "after"
        });
    }

    /**
     * Tries to delete a report using the id. 
     * Throws an error if report not found by the id
     * @throws { NotFoundException }
     */
    async fetchAndDeleteOneById(id: string) {
        const report = await this.findOneById(id);

        return this.reportRepository.query().findByIdAndDelete(id, {
            returnDocument: "before"
        });
    }
}