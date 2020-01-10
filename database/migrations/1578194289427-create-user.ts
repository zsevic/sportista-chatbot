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
                name: 'username',
                type: 'varchar',
            }, {
                name: 'email',
                type: 'varchar',
            }, {
                name: 'password',
                type: 'varchar',
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
