import { Role } from "../../common/role.type";

export class CreateTokenDto {
    id: number;
    email: string;
    role: Role;
}

export class Token {
    accessToken: string;
}

export interface VerifiedToken extends CreateTokenDto {
    iat: number;
    exp: number;
}
