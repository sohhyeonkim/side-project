import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CommonEntity } from "../../common/common.entity";
import { Tour } from "../../tour/entities/tour.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Reservation extends CommonEntity{
    @ManyToOne(() => Tour, tour => tour.reservations, {cascade: true, onDelete: 'CASCADE'})
    tour: Tour;

    @ManyToOne(() => User, user => user.reservations, {cascade: true, onDelete: 'CASCADE'})
    user: User;

    @Column()
    reservedDate: string;

    @Column({
        default: false
    })
    isConfirmed: boolean;
}
