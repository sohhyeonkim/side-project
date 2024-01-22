import { Column, Entity, OneToMany } from "typeorm";
import { CommonEntity } from "../../common/common.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";

@Entity()
export class Tour extends CommonEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @OneToMany(() => Reservation, reservation => reservation.tour)
    reservations: Reservation[];
}
