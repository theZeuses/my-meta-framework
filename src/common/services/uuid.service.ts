import { nanoid } from "nanoid";

export class UUIDService {
    uuid() {
        return nanoid();
    }
}