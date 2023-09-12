import * as cors from 'cors';
import * as dotenv from "dotenv";
import * as request from 'supertest';
import { Application } from "express";
import { AppModule } from "@src/app.module";
import { ApplicationFactory } from "@core/application";
import { User } from "@modules/user/schema/user.schema";
import { AppOptions } from "@core/application/interface";
import { truncateCollections } from "@scripts/truncate_collections";
import { VerificationCode } from "@modules/verification-code/schema";
import { seedData } from '@scripts/seed_data';
import { CreateUserStub, UsersStub } from '@modules/user/test/stub/users.stub';
import { GlobalExceptionFilter } from '@common/filter/global-exception.filter';

dotenv.config({
    path: "../.env.test"
})

describe("Auth (e2e)", () => {
    let app: Application;

    beforeAll(async () => {
        const appOptions: AppOptions = {
            staticFolder: 'public',
            cookieParser: process.env.COOKIE_SECRET,
            globalFilter: GlobalExceptionFilter
        }
        app = await ApplicationFactory.create(AppModule, appOptions);
    
        app.use(cors({credentials: true, origin: true}));

        await truncateCollections([User, VerificationCode]);
        await seedData(User, UsersStub);
    });

    describe("POST /v1/auth/register", () => {
        it('should should return error because of bad request payload', async () => {
            const response = await request(app)
                .post('/v1/auth/register')
                .send({
                    name: test
                });

            expect(response.statusCode).toBe(400);
        });

        it('should should return error when duplicate email is passed', async () => {
            const response = await request(app)
                .post('/v1/auth/register')
                .send({
                    ...CreateUserStub.duplicate
                });

            expect(response.statusCode).toBe(422);
        });

        it('should successfully register the user as USER', async () => {
            const response = await request(app)
                .post('/v1/auth/register')
                .send({
                    ...CreateUserStub.new
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.user).toHaveProperty('role', "USER");
        });
    })
}) 