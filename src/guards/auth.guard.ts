import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateTokenDto, VerifiedToken } from "../auth/dto/create-token.dto";
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    try {
        console.log('authguard working');
        const request = context.switchToHttp().getRequest();

        const token: string | undefined = this.extractTokenFromHeader(request);
      
        if(!token) {
          throw new UnauthorizedException();
        }

        const { id, email, role }:VerifiedToken =  await this.jwtService.verifyAsync(token);

        request.user = { id, email, role } as CreateTokenDto;       
        return true; 
    } catch(err) {
        throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}