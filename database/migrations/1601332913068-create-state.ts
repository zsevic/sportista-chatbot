import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateState1601332913068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'state',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            generationStrategy: 'uuid',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'current_state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location_title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location_latitude',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'location_longitude',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'datetime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'remaining_vacancies',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'current_timestamp',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('state');
  }
}
