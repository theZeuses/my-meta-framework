import { User, UserDocument } from "./schema/user.schema";
import { Repository } from "@core/mongo";

export class UserRepository extends Repository<typeof User> {
    constructor () {
        super(User);
    }

    findOneById(id: string) {
        return this.query().findOne<UserDocument>({
            _id: id,
            deleted_at: null
        });
    }

    findOneByEmail(email: string) {
        return this.query().findOne<UserDocument>({
            email,
            deleted_at: null
        });
    }
}