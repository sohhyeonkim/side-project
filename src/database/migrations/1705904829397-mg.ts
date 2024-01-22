import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1705904829397 implements MigrationInterface {
    name = 'Mg1705904829397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tour\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`date\` varchar(255) NOT NULL, \`tourId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`role\` enum ('CUSTOMER', 'ADMIN', 'PARTNER') NOT NULL DEFAULT 'CUSTOMER', UNIQUE INDEX \`email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`partner\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`role\` enum ('CUSTOMER', 'ADMIN', 'PARTNER') NOT NULL DEFAULT 'PARTNER', \`countryCode\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`continent\` enum ('AMERICA', 'ASIA', 'EUROPE', 'OCEANIA') NOT NULL, \`tourId\` int NULL, UNIQUE INDEX \`REL_226947c0979c0040517e6f9b93\` (\`tourId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_22e945ff6e0eb15b5a0179a0eb4\` FOREIGN KEY (\`tourId\`) REFERENCES \`tour\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_529dceb01ef681127fef04d755d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`partner\` ADD CONSTRAINT \`FK_226947c0979c0040517e6f9b93d\` FOREIGN KEY (\`tourId\`) REFERENCES \`tour\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`partner\` DROP FOREIGN KEY \`FK_226947c0979c0040517e6f9b93d\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_529dceb01ef681127fef04d755d\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_22e945ff6e0eb15b5a0179a0eb4\``);
        await queryRunner.query(`DROP INDEX \`REL_226947c0979c0040517e6f9b93\` ON \`partner\``);
        await queryRunner.query(`DROP TABLE \`partner\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`reservation\``);
        await queryRunner.query(`DROP TABLE \`tour\``);
    }
}
