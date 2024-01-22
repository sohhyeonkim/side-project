import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto extends PartialType(CreateUserDto) {
    constructor(props: Pick<CreateUserDto, 'email' | 'password'>) {
        super();
        Object.assign(this, props);
    }

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}
