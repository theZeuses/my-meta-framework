import { Injectable } from "@core/application";
import { IGuard } from "@core/application/interface";
import { UnauthorizedException } from "@core/exceptions";
import { JWTService } from "@modules/auth/services";
import { Request, Response } from "express";

@Injectable()
export class AuthenticateGuard implements IGuard {
    constructor(
        private readonly jwtService: JWTService
    ) {}

    async canProceed(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) throw new UnauthorizedException();

        const payload = this.jwtService.authenticateBearerToken(token);
        if(!payload) throw new UnauthorizedException();
        
        req.user = payload;

        return true;
    }
}