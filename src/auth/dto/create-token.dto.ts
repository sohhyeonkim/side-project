import { Role } from "../../common/role.type";

export class CreateTokenDto {
    id: number;
    email: string;
    role: Role;
}

export class Token {
    accessToken: string;
}