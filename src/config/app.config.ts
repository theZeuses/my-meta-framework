import * as dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    mail_from: 'mailer@blockstack.io',
    bearer_token_secret: process.env.BEARER_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
}