import { IGlobalExceptionFilter } from "@core/application/interface";
import { InternalServerErrorException } from "@core/exceptions";
import { BaseException } from "@core/exceptions/BaseException";
import { Request, Response } from "express";

export class GlobalExceptionFilter implements IGlobalExceptionFilter {
    async catch(err: any, req: Request, res: Response) {
        if (err instanceof BaseException) {
            return res.status(err.getData().statusCode).json(err.getData())
        } else {
            console.log(err)
            return res.status(500).json(new InternalServerErrorException())
        }
    }
}