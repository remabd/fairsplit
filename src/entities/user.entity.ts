import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { SpaceParticipant } from './space-participant.entity.js';

export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({ type: 'varchar', default: UserRole.MEMBER })
    role!: UserRole;

    @Column({ default: false })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => SpaceParticipant, (sp) => sp.user)
    spaceParticipants!: SpaceParticipant[];
}
