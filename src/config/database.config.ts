import * as dotenv from "dotenv";
dotenv.config();

export const dbConfig = {   
  mongoURI: process.env.MONGO_DB_URL,
  debug: true
}