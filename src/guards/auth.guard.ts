import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateTokenDto } from "../auth/dto/create-token.dto";

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
        const accessToken = request.headers.authorization.split(' ')[1];
        const user: CreateTokenDto = await this.jwtService.verify(accessToken, {
            secret: process.env.JWT_ACCESS_SECRET
        });
        request.user = user;
        return user;
    } catch(err) {
        return false;
    }
  }
}