import { Request, Response } from "express";
import { IGlobalExceptionFilter } from "./request-life.interface";

export interface AppOptions {
    staticFolder?: string,
    cookieParser?: string | true;
    globalExceptionFilter?: Newable<IGlobalExceptionFilter>;
}