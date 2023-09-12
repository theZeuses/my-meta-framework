import { IHash } from "@common/interface";

export class ArgonService implements IHash {
    async hash(plain: string) {
        return `hashed-${plain}`;
    }

    async verify(hashed: string, plain: string) {
        return hashed === `hashed-${plain}`;
    }
}