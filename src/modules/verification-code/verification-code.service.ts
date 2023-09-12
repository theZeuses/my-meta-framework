import { VERIFICATION_CODE_CHANNEL, VERIFICATION_CODE_TYPE } from "@common/constants";
import { InsertVerificationCodeDto } from "./dto";
import { VerificationCodeRepository } from "./verification-code.repository";
import * as moment from "moment";
import { ForbiddenException, NotFoundException } from "@core/exceptions";
import { Exception } from "@core/consts";
import { Injectable } from "@core/application";
import { VerificationCodeDocument } from "./schema";
import { ArgonService } from "@common/services";
import { VerificationCodifyService } from "./service";
import { validateObjectId } from "@core/mongo";

@Injectable()
export class VerificationCodeService {
    private maximum_retry_limit;
    constructor(
        private readonly verificationCodeRepository: VerificationCodeRepository,
        private readonly verificationCodifyService: VerificationCodifyService,
        private readonly hashService: ArgonService
    ) {
        this.maximum_retry_limit = 3;
    }

    /**
     * Inserts verification code after hashing the code
     */
    async insertOne(dto: InsertVerificationCodeDto): Promise<VerificationCodeDocument> {
        dto.code = await this.hashService.hash(dto.code);
        return this.verificationCodeRepository.query().create(dto);
    }

    /**
     * Returns a verification code by id
     */
    async getOneById(id: string): Promise<VerificationCodeDocument | null> {
        validateObjectId(id);

        return this.verificationCodeRepository.query().findById(id);
    }

    async patchOneById(id: string, verificationCode: Partial<VerificationCodeDocument>) {
        validateObjectId(id);

        return this.verificationCodeRepository.query().updateOne({
            _id: id
        }, verificationCode);
    }

    /**
     * Tries to verify inputted code after fetching the verification code associated with the id.
     * If the code doesn't match then increments the attempts count by one.
     * @throws { NotFoundException | ForbiddenException }
     */
    async verifyOne(id: string, code: string) {
        const verificationCode = await this.getOneById(id);

        if (!verificationCode) {
            throw new NotFoundException(Exception.NotFoundException.ENTITY_NOT_FOUND);
        }

        this.verificationCodifyService.verifyCodeExpiry(verificationCode);
        this.verificationCodifyService.verifyCodeAttempts(verificationCode, this.maximum_retry_limit);

        //try matching the codes
        if (!await this.hashService.verify(verificationCode.code, code)) {
            await this.patchOneById(verificationCode.id, {
                attempts: verificationCode.attempts + 1
            });
            throw new ForbiddenException(Exception.ForbiddenException.CODE_DOES_NOT_MATCH);
        }

        return {
            channel: verificationCode.channel,
            medium: verificationCode.medium,
            type: verificationCode.type,
            reference_id: verificationCode.reference_id
        }
    }

    /**
     * Create a verification code with a 6 digit code.
     */
    async createOneForEmailVerification(email: string, reference_id: string) {
        const code = this.verificationCodifyService.generateOTP(6);

        const verificationCode = await this.insertOne({
            code,
            attempts: 0,
            channel: VERIFICATION_CODE_CHANNEL.EMAIL,
            medium: email,
            reference_id,
            type: VERIFICATION_CODE_TYPE.EMAIL_VERIFICATION,
            expires_at: moment().add(5, 'minutes').toDate()
        })

        return {
            verificationCode: this.deleteCodeFromVerificationCodeDocument(verificationCode),
            code
        }
    }

    deleteCodeFromVerificationCodeDocument(verificationCode: VerificationCodeDocument) {
        const verificationCodeWithoutCode: PartialPartial<VerificationCodeDocument, "code"> = verificationCode.toObject();
        delete verificationCodeWithoutCode.code;

        return verificationCodeWithoutCode;
    }
}