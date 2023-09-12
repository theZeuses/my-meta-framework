import { Role } from "@common/constants";
import { Injectable } from "@core/application";
import { IGuard } from "@core/application/interface";
import { ForbiddenException, UnauthorizedException } from "@core/exceptions";
import { Request, Response } from "express";

@Injectable()
export class AdminGuard implements IGuard {
    async canProceed(req: Request, res: Response) {
        if(!req.user) throw new UnauthorizedException();
        
        if(req.user.role != Role.ADMIN) throw new ForbiddenException();

        return true;
    }
}