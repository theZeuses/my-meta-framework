import { ArgonService } from "@common/services";
import { UserRepository } from "@modules/user/user.repository";
import { UserService } from "@modules/user/user.service";
import { CreateUserStub, UsersStub } from "../stub/users.stub";
import { BadRequestException, NotFoundException, UnprocessableEntityException } from "@core/exceptions";
import { Exception } from "@core/consts";
import { closeMemoryMongoConnection, dropCollections, seedTestData } from "@core/mongo/Testing";
import { User } from "@modules/user/schema/user.schema";

jest.mock("@common/services/hash.service");

describe("UserService", () => {
    let userService: UserService;

    beforeAll(async () => {
        userService = new UserService(
            new UserRepository(),
            new ArgonService()
        );

        jest.clearAllMocks();

        await dropCollections();
        await seedTestData(User, UsersStub);
    })

    afterEach(() => {    
        jest.clearAllMocks();
    });

    describe("when findOneById() called", () => {
        describe("and called with invalid id", () => {
            it("should throw a BadRequestException", async () => {
                expect(async () => {
                    await userService.findOneById(`invalid${UsersStub[0]._id}`);
                }).rejects.toThrow(new BadRequestException(Exception.BadRequestException.INVALID_PARAM))
            })
        });
        describe("and called with valid id", () => {
            describe("but no user found for id", () => {
                it("should throw a NotFound Exception", () => {
                    expect(async () => {
                        await userService.findOneById(`${UsersStub[0]._id.slice(0, -1)}f`);
                    }).rejects.toThrow(new NotFoundException(Exception.NotFoundException.ENTITY_NOT_FOUND));                    
                });
            });
            describe("and user found for id", () => {
                it("should return one user", async () => {
                    const result = await userService.findOneById(UsersStub[0]._id);
                   
                    expect(result).toBeDefined();
                    expect(result).toMatchObject(Object.create({}))
                });

                it("should return a matching user", async () => {
                    const result = await userService.findOneById(UsersStub[0]._id);
                    const {_id, password, ...withOutPassword} = UsersStub[0];
                    expect(result).toMatchObject(withOutPassword)
                });

                it("should return a user without password", async () => {
                    const result = await userService.findOneById(UsersStub[0]._id);
                   
                    expect(result).not.toHaveProperty("password");
                    expect(result).toHaveProperty("role", "USER")
                });
            });
        });
    });

    describe("when createOneAndFetch() called", () => {
        describe("and called with a user data with existing email", () => {
            it("should throw a UnprocessableEntityException", async () => {
                expect(async () => {
                    await userService.createOneAndFetch(CreateUserStub.duplicate);
                }).rejects.toThrow(new UnprocessableEntityException(Exception.UnprocessableEntityException.UNIQUE_VALIDATION_FAILED))
            })
        });
        describe("and called with a user data with unique email", () => {
            let user;
            beforeAll(async () => {
                jest.spyOn(ArgonService.prototype, "hash");
                user = await userService.createOneAndFetch(CreateUserStub.new); 
            })
            it("should hash the password", () => {
                expect(ArgonService.prototype.hash).toHaveBeenCalledWith(CreateUserStub.new.password);
            });

            it("should return one user", async () => {               
                expect(user).toBeDefined();
                expect(user).toMatchObject(Object.create({}))
            });

            it("should return a matching user", async () => {
                const {password, ...withOutPassword} = CreateUserStub.new;
                expect(user).toMatchObject(withOutPassword)
            });

            it("should return a user without password and with default role: USER", async () => {               
                expect(user).not.toHaveProperty("password");
                expect(user).toHaveProperty("role", "USER")
            });
        });
    })
});