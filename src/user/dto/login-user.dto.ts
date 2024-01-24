import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/role.type';
import { IsEnum } from 'class-validator';

export class LoginUserDto {
    constructor(props: Pick<CreateUserDto, 'email' | 'password' | 'role'>) {
        Object.assign(this, props);
    }

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @IsEnum(Role)
    @ApiProperty({type: 'enum', enum: Role})
    role: Role;
}
