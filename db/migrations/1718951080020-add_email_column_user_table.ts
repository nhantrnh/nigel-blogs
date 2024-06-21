import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumnUserTable1718951080020 implements MigrationInterface {
    name = 'AddEmailColumnUserTable1718951080020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
