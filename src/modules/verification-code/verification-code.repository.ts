import { Repository } from "@core/mongo";
import { VerificationCode } from "./schema";

export class VerificationCodeRepository extends Repository<typeof VerificationCode> {
    constructor() {
        super(VerificationCode);
    }
}