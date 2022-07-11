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
                email       : 'admin@1aservices.com',
                country_code: '91',
                phone       : '1234567890',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'Service Agent',
                email       : 'service_agent@1aservices.com',
                country_code: '91',
                phone       : '1234567891',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'Admin Alchemy',
                email       : 'admin@alchemytech.ca',
                country_code: '91',
                phone       : '1234567892',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'Murtaza Vohra',
                email       : 'murtaza@alchemytech.ca',
                country_code: '91',
                phone       : '9106563248',
                password    : bcrypt.hashSync('123456', 8),
            },
            {
                name        : 'Sagar Parmar',
                email       : 'sagar@alchemytech.ca',
                country_code: '91',
                phone       : '9979777258',
                password    : bcrypt.hashSync('123456', 8),
            },
        ]
        // @ts-ignore
        await userRepository.save(groups);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
