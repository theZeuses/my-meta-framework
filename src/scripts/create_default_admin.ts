import { mustBeStringOrFail } from "@common/utils/string.utils";
import { User } from "@modules/user/schema/user.schema";

export async function initDefaultAdmin() {
    const existingAdmin = await User.findOne({
        email: mustBeStringOrFail(process.env.DEFAULT_ADMIN_EMAIL)
    });

    if (!existingAdmin) {
        await User.create({
            name: "admin",
            email: mustBeStringOrFail(process.env.DEFAULT_ADMIN_EMAIL),
            password: "$argon2id$v=19$m=4096,t=3,p=1$lW96ktOe0NC8M0k+BspFqw$q7x3SbtZz6XLlOJ3k3RogEfgXcM8mM/adetEVhAID1g",
            email_verified_at: new Date(),
            role: "ADMIN"
        })
    }
}