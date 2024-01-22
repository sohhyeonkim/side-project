import { ApiProperty } from "@nestjs/swagger";

interface CreateReservationProps {
    userId: number;
    tourId: number;
    reservedDate: string;
}
export class CreateReservationDto implements CreateReservationProps{
    constructor(props: CreateReservationProps) {
        Object.assign(this, props);
    }
    @ApiProperty()
    userId: number;

    @ApiProperty()
    tourId: number;

    @ApiProperty()
    reservedDate: string;
}
