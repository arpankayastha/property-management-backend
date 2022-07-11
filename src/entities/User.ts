import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
// @ts-ignore
import * as bcrypt from "bcryptjs";

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    country_code: string;

    @Column({unique: true})
    phone: string;

    @Column({nullable: true})
    pin: string

    @Column({nullable: true})
    session_token: string;

    @Column({nullable: true})
    device_type: string;

    @Column({nullable: true})
    device_token: string;

    @Column({default: "en"})
    language_code: string;

    @Column({nullable: true})
    internal_notes: string;

    @Column({default: true})
    is_active: boolean;

    @Column({default: false})
    is_pin_set: boolean;

    @Column({nullable: true})
    forgot_password_token: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password ?? 'Admin@123', 8);
    }

    verifyPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}
