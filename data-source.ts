import { DataSource } from "typeorm"
import {config} from 'dotenv';
import { User } from "./src/user/entities/user.entity";
import { Reservation } from "./src/reservation/entities/reservation.entity";
import { Tour } from "./src/tour/entities/tour.entity";
import { Partner } from "./src/partner/entities/partner.entity";

config({ path: `.env.${process.env.NODE_ENV}` });

export default new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrations: ["./src/database/migrations/*.ts"],
    entities: [User, Reservation, Tour, Partner],
});

