import { ArgonService } from "../hash.service";
import * as argon from "argon2";

describe("ArgonService", () => {
    let argonService: ArgonService;

    beforeAll(() => {
        argonService = new ArgonService();
    })

    describe("when hash() is called", () => {
        it("should call hash function of argon", async () => {
            jest.spyOn(argon, "hash");
            await argonService.hash("plain");
            expect(argon.hash).toHaveBeenCalledWith("plain")
        })

        it("should return a hashed string", async () => {
            const hashed = await argonService.hash("plain");

            expect(typeof hashed).toBe("string");
            expect(hashed).not.toEqual("plain");
        })
    });

    describe("when verify() is called", () => {
        it("should call verify function of argon", async () => {
            jest.spyOn(argon, "verify");
            await argonService.verify("$argon2id$v=19$m=4096,t=3,p=1$lW96ktOe0NC8M0k+BspFqw$q7x3SbtZz6XLlOJ3k3RogEfgXcM8mM/adetEVhAID1g", "plain");
            expect(argon.verify).toHaveBeenCalledWith("$argon2id$v=19$m=4096,t=3,p=1$lW96ktOe0NC8M0k+BspFqw$q7x3SbtZz6XLlOJ3k3RogEfgXcM8mM/adetEVhAID1g", "plain")
        })

        it("should return false if hash doesn't match", async () => {
            const matched = await argonService.verify("$argon2id$v=19$m=4096,t=3,p=1$lW96ktOe0NC8M0k+BspFqw$q7x3SbtZz6XLlOJ3k3RogEfgXcM8mM/adetEVhAID1g", "plain");

            expect(matched).toEqual(false);
        })

        it("should return true if hash matches", async () => {
            const matched = await argonService.verify(await argonService.hash("plain"), "plain");

            expect(matched).toEqual(true);
        })
    });
})