import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSomeFieldsToUserTable1718953432718 implements MigrationInterface {
    name = 'AddSomeFieldsToUserTable1718953432718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refreshToken\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updateAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refreshToken\``);
    }

}
