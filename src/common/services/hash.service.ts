import { IHash } from "@common/interface";
import * as argon from "argon2";

export class ArgonService implements IHash {
    async hash(plain: string) {
        return argon.hash(plain);
    }

    async verify(hashed: string, plain: string) {
        return argon.verify(hashed, plain);
    }
}