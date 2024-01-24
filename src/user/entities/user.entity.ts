import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CommonEntity } from "../../common/common.entity";
import { Role } from "../../common/role.type";
import { Reservation } from "../../reservation/entities/reservation.entity";

@Entity()
@Index(["email"], { unique: true })
export class User extends CommonEntity{
    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    lastName: string;

    @Column()
    firstName: string;

    @Column({type:'enum', enum: Role, default: Role.CUSTOMER})
    role: Role;

    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[];
}
