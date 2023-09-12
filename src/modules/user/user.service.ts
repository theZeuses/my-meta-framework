import { CreateUserDto } from './dto';
import { NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { UserRepository } from './user.repository';
import { Injectable } from '@core/application';
import { Exception } from '@core/consts';
import { UserDocument } from './schema/user.schema';
import { ArgonService } from '@common/services';
import { validateObjectId } from '@core/mongo';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: ArgonService
    ) { }

    /**
     * Returns an user without password matched by id. If the Id is not valid ObjectId
     * or no user found for the id then throws an error 
     * @throws {BadRequestException | NotFoundException}
     */
    async findOneById(id: string) {
        validateObjectId(id);

        const user = await this.userRepository.findOneById(id);

        if (!user) throw new NotFoundException(Exception.NotFoundException.ENTITY_NOT_FOUND);

        return this.deletePasswordFromUserDocument(user);
    }

    /**
     * Finds a user by email and returns without password. Throws an error if not found
     * @throws { NotFoundException }
     */
    async findOneByEmail(email: string) {
        const user = await this.userRepository.findOneByEmail(email);

        if (!user) throw new NotFoundException(Exception.NotFoundException.ENTITY_NOT_FOUND);

        return this.deletePasswordFromUserDocument(user);
    }

    /**
     * Finds a user by email and returns with password. Throws an error if not found
     * @throws { NotFoundException }
     */
    async getOneByEmailWithPassword(email: string) {
        return this.userRepository.findOneByEmail(email);
    }

    /**
     * Finds a user by id and returns with password. Throws an error if not found
     * @throws { NotFoundException }
     */
    async getOneByIdWithPassword(id: string) {
        return this.userRepository.findOneById(id);
    }

    /**
     * Gets a user by email and returns without password.
     */
    async getOneByEmail(email: string) {
        const user = await this.userRepository.findOneByEmail(email);

        if (!user) return user;

        return this.deletePasswordFromUserDocument(user);
    }

    /**
     * Gets a user by id and returns without password.
     * If id is not valid ObjectId then throws an error
     * @throws { BadRequestException }
     */
    async getOneById(id: string) {
        validateObjectId(id);

        const user = await this.userRepository.findOneById(id);

        if (!user) return user;

        return this.deletePasswordFromUserDocument(user);
    }

    /**
     * Tries to create a new user after hashing the plain password and return without password.
     * Throws an exception is duplicate email is found.
     * @throws { UnprocessableEntityException }
     */
    async createOneAndFetch(dto: CreateUserDto) {
        const user = await this.getOneByEmail(dto.email);
        if (user) throw new UnprocessableEntityException(Exception.UnprocessableEntityException.UNIQUE_VALIDATION_FAILED);

        //hash the password before saving to db
        const hashedPassword = await this.hashService.hash(dto.password);

        const insertedUser = await this.userRepository.query().create({
            ...dto,
            password: hashedPassword
        });

        return this.deletePasswordFromUserDocument(insertedUser);
    }

    async patchOneById(id: string, dto: Partial<UserDocument>) {
        const user = await this.findOneById(id);

        if (dto.email && user.email != dto.email) {
            const user = await this.getOneByEmail(dto.email);
            if (user && user._id.equals(id)) throw new UnprocessableEntityException(Exception.UnprocessableEntityException.UNIQUE_VALIDATION_FAILED);
        }

        return this.userRepository.query().updateOne({
            _id: id
        }, dto);
    }

    async makeAnUserAdmin(id: string) {
        validateObjectId(id);

        await this.patchOneById(id, {
            role: "ADMIN"
        });

        return {
            success: true
        }
    }

    deletePasswordFromUserDocument(user: UserDocument) {
        //exclude user.password
        const userWithoutPassword: PartialPartial<UserDocument, "password"> = user.toObject();
        delete userWithoutPassword.password;

        return userWithoutPassword;
    }
}