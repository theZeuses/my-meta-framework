import { Repository } from "@core/mongo";
import { Report } from "./schema";

export class ReportRepository extends Repository<typeof Report> {
    constructor() {
        super(Report);
    }
}