import { ApiProperty } from "@nestjs/swagger";
import { Continent } from "../types/continent.type";
import { Transform } from "class-transformer";
import { Matches } from "class-validator";

interface CreatePartnerProps {
    name: string;
    countryCode: string;
    phoneNumber: string;
    email: string;
    password: string;
    continent: Continent;
}
export class CreatePartnerDto implements CreatePartnerProps {
    constructor(props: CreatePartnerProps) {
        this.name = props.name;
        this.countryCode = props.countryCode;
        this.phoneNumber = props.phoneNumber;
        this.email = props.email;
        this.password = props.password;
        this.continent = props.continent;
    }

    @ApiProperty()
    name: string;

    // remove all non-numeric characters
    @Transform(({value}) => value.replace(/\D/g, ''))
    @ApiProperty()
    countryCode: string;

    // remove all non-numeric characters
    @Transform(({value}) => value.replace(/\D/g, ''))
    @ApiProperty()
    phoneNumber: string;

    @Matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, {message: '유효하지 않은 이메일 형식'})
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty({ type: 'enum', enum: Continent })
    continent: Continent;
    
}
