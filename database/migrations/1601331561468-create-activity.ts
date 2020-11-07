import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateActivity1601331561468 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activity',
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
            name: 'location_id',
            type: 'uuid',
          },
          {
            name: 'organizer_id',
            type: 'bigint',
          },
          {
            name: 'price_id',
            type: 'uuid',
          },
          {
            name: 'datetime',
            type: 'timestamp',
          },
          {
            name: 'remaining_vacancies',
            type: 'int',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
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
    await queryRunner.dropTable('activity');
  }
}
