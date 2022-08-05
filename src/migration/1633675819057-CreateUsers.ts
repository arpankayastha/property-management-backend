import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entities/User";
// @ts-ignore
import * as bcrypt from "bcryptjs";

export class CreateUsers1633675819057 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepository = getRepository(User);
        let groups           = [
            {
                name        : 'Admin',
                email       : 'admin@demo.in',
                country_code: '91',
                phone       : '1234567890',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'manager',
                email       : 'manager@demo.in',
                country_code: '91',
                phone       : '1234567891',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'Dummy Dome',
                email       : 'dummy@demo.in',
                country_code: '91',
                phone       : '9393449922',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'Jhon Doe',
                email       : 'jhon@demo.in',
                country_code: '91',
                phone       : '9988774433',
                password    : bcrypt.hashSync('123456', 8),
            },
        ]
        // @ts-ignore
        await userRepository.save(groups);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
