import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateTokenDto, VerifiedToken } from "../auth/dto/create-token.dto";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Role } from "../common/role.type";
import { ConfigService } from "@nestjs/config";
import { REQUIRED_ROLES } from "../decorators/roles.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    try {
        console.log('authguard working');
        const request = context.switchToHttp().getRequest();

        // Public 데코레이터가 명시된 경우, Authguard 통과
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) {
          return true;
        }

        const token: string | undefined = this.extractTokenFromHeader(request);

        if(!token) {
          throw new UnauthorizedException('No token provided');
        }

        const { id, email, role }:VerifiedToken =  await this.jwtService.verifyAsync(token);
        
        // Roles 데코레이터에 명시된 역할에 유저의 역할이 포함되어 있는지 검사
        const requiredRoles = this.reflector.get<Role[]>(REQUIRED_ROLES, context.getHandler());
        
        if(!this.matchRoles(requiredRoles, role)) {
          throw new UnauthorizedException('Unauthorized role');
        }

        request.user = { id, email, role } as CreateTokenDto;       
        return true; 
    } catch(err) {
      console.error(err);
        throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private matchRoles(requiredRoles: Role[], userRole: Role): boolean {
    return !requiredRoles || requiredRoles.includes(userRole);
  }
}