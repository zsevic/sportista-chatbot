import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { AppRoles } from 'src/auth/roles/roles.enum';

export class SeedUser1578622062167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(UserEntity, [{
            id: '55e84252-3a29-4f13-aa9e-839c7a270f74',
            username: 'username',
            email: 'admin@test.com',
            role: AppRoles.ADMIN,
            password: 'password',
        }]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.clear(UserEntity);
    }

}
