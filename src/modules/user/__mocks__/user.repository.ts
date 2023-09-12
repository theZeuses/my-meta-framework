import { UsersStub } from "../test/stub/users.stub";

export class UserRepository {
    findOneById(id: string) {
        return jest.fn().mockResolvedValueOnce(() => {
            return UsersStub.filter(user => user._id == id)
        })
    }

    findOneByEmail(email: string) {
        return jest.fn().mockResolvedValueOnce(() => {
            return UsersStub.filter(user => user.email == email)
        })
    }

    query() {
        return this
    }
}