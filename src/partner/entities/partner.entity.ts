import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, Unique } from "typeorm";
import { CommonEntity } from "../../common/common.entity";
import { Continent } from "../types/continent.type";
import { Tour } from "../../tour/entities/tour.entity";
import { Role } from "../../common/role.type";

@Entity()
@Index(["countryCode", "phoneNumber"], { unique: true })
@Index(["email"], { unique: true })
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

    @Column()
    password: string;

    @Column({type: 'enum', enum: Continent})
    continent: Continent;

    @Column({
        type: 'boolean',
        default: false
    })
    isVerified: boolean;

    @OneToOne(() => Tour, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    tour: Tour;
}
