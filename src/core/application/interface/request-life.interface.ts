import { Request, Response } from "express";

export interface IGuard {
    canProceed(req: Request, res: Response) : Promise<boolean>;
}

export interface IValidateBody {
    transform(body: Record<string, any>): Record<string, any>
}

export interface IValidateQuery {
    transform(body: Record<string, any>): Record<string, any>
}

export interface IGlobalExceptionFilter {
    catch(err: any, req: Request, res: Response): Promise<Response>
}