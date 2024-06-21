import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
    private configService: ConfigService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token){
            throw new UnauthorizedException('Token not found');
        }

        try{
            const payload = await this.jwtService.verifyAsync(token,{
                secret: this.configService.get<string>('SECRET')
            });

            request['user_data'] = payload;

        }catch{
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string|undefined {
        const[authType, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];

        return authType === 'Bearer' ? token : undefined;
    }
}
