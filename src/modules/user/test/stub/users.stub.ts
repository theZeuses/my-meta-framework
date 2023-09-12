import { CreateUserDto } from "@modules/user/dto";
import { IUser } from "@modules/user/schema/user.schema";

export const UsersStub: Array<IUser & { _id: string }> = [
    {
        _id: "64fcfff13973420d0a05d61e",
        email: "1@email.com",
        password: "password",
        name: "1",
        phone: "01911111111"
    },
    {
        _id: "64fcfff13973420d0a05d62e",
        email: "2@email.com",
        password: "password",
        name: "2"  
    },
]

export const CreateUserStub: {
    new: CreateUserDto,
    duplicate: CreateUserDto
} = {
    new: {
        email: "3@email.com",
        password: "password",
        name: "1",
        phone: "01911111111",
        favorite_colors: [
            "test"
        ],
        profession: "test",
        address: "test"
    },
    duplicate: {
        email: "1@email.com",
        password: "password",
        name: "1",
        phone: "01911111111",
        favorite_colors: [
            "test"
        ],
        profession: "test",
        address: "test"
    }
}