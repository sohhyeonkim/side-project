import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CommonEntity } from "../../common/common.entity";
import { Continent } from "../types/continent.type";
import { Tour } from "../../tour/entities/tour.entity";
import { Role } from "../../common/role.type";

@Entity()
export class Partner extends CommonEntity {
    @Column()
    name: string;

    @Column({type: 'enum', enum: Role, default: Role.PARTNER})
    role: Role;

    @Column()
    countryCode: string;

    @Column()
    phoneNumber: string;

    @Column()
    email: string;  

    @Column({type: 'enum', enum: Continent})
    continent: Continent;

    @OneToOne(() => Tour, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    tour: Tour;
}
