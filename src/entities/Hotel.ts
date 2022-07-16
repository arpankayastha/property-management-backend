import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
// @ts-ignore
import * as bcrypt from "bcryptjs";
import {Property} from "./Property";

@Entity('hotels')
export class Hotel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    location: string;

    @Column({nullable: true})
    address: string;

    @Column({nullable: true})
    contactPerson: string;

    @Column({nullable: true})
    contactNumber: string;

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Property, object => object.hotel, {nullable: true})
    properties: Property[];
}
