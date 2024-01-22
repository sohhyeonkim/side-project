import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Continent } from "../../partner/types/continent.type";
import { Partner } from "../../partner/entities/partner.entity";
import { Tour } from "../../tour/entities/tour.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import moment = require("moment-timezone");
import { User } from "../../user/entities/user.entity";
export class Seeds1705910569059 implements MigrationInterface {
    
    private async hashPassword(password: string) {
        return bcrypt.hash(password, 10)
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        // bulk insert users
        const users = Array.from({ length: 5 }).map(() => {
            const u = new User();
            u.email = Math.random().toString(36).substring(7) + '@gmail.com';
            u.password =  Math.random().toString(36).substring(8);
            u.firstName = Math.random().toString(36).substring(4);
            u.lastName = Math.random().toString(36).substring(4);
            return u;
        });

        // Hash passwords before inserting
        const usersWithHashedPasswords = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await this.hashPassword(user.password),
            }))
        );

        const savedUsers = await queryRunner.manager.save('user', usersWithHashedPasswords);

        // bulk insert partners
        const partners = Array.from({ length: 5 }).map(() => {
            const p = new Partner();
            p.name = Math.random().toString(36).substring(7);
            p.email= Math.random().toString(36).substring(7) + '@gmail.com';
            p.password= Math.random().toString(36).substring(8);
            p.countryCode= Math.random().toString(36).substring(4);
            p.phoneNumber= Math.random().toString(36).substring(4);
            p.continent= Continent.ASIA;
            return p;
        });

        // Hash passwords before inserting
        const partnersWithHashedPasswords = await Promise.all(
            partners.map(async (partner) => ({
                ...partner,
                password: await this.hashPassword(partner.password),
            }))
        );

        const savedPartener:Partner[] = await queryRunner.manager.save('partner', partnersWithHashedPasswords);

        // bulk insert tours
        const tours = Array.from({ length: 5 }).map(() => {
            const t = new Tour();
            t.name = Math.random().toString(36).substring(7);
            t.description = Math.random().toString(36).substring(7);
            t.price = Math.random() * 1000;
            return t;
        });

        const savedTours = await queryRunner.manager.save('tour', tours);

        // assign tours to partners
        savedPartener.map((el, idx)=> {
            el.tour = savedTours[idx];
        });

        await queryRunner.manager.save('partner', savedPartener);

        // save reservations
        const reservations = Array.from({ length: 5 }).map((el, idx) => {
            const r = new Reservation();
            r.reservedDate = moment().add(idx, 'days').format('YYYY-MM-DD');
            r.tour = savedTours[idx];
            r.user = savedUsers[idx];
            return r;
        });

        await queryRunner.manager.save('reservation', reservations);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
