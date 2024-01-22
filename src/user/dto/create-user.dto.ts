import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../common/role.type";
import { Matches } from "class-validator";


interface CreateUserProps { 
    email: string;
    password: string;
    lastName: string;
    firstName: string;
}
export class CreateUserDto {
    constructor(props: CreateUserProps) {
        this.role = Role.CUSTOMER;
        Object.assign(this, props);
    }

    @ApiProperty({type: 'enum', enum: Role})
    role: Role

    @Matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, {message: '유효하지 않은 이메일 형식'})
    @ApiProperty()
    email: string;

    @Matches(/^[a-z]{8,}$/, {message: '영어 소문자 8자 이상'})
    @ApiProperty()
    password: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    firstName: string;
}
