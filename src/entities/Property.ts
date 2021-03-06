import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
// @ts-ignore
import * as bcrypt from "bcryptjs";
import {Hotel} from "./Hotel";

@Entity('properties')
export class Property extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Hotel, object => object.properties, {nullable: true})
    hotel: Hotel;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    propertyId: string;

    @Column({nullable: true})
    propertyLockFile: string;

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
