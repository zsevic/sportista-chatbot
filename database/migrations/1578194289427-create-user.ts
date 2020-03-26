import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1578194289427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [{
                name: 'id',
                type: 'uuid',
                isPrimary: true,
            }, {
                name: 'facebook_id',
                type: 'uuid',
                isNullable: true,
            }, {
                name: 'google_id',
                type: 'uuid',
                isNullable: true,
            }, {
                name: 'name',
                type: 'varchar',
            }, {
                name: 'avatar',
                type: 'varchar',
            }, {
                name: 'email',
                type: 'varchar',
            }, {
                name: 'password',
                type: 'varchar',
                isNullable: true,
            }, {
                name: 'role',
                type: 'varchar',
            }],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }

}
