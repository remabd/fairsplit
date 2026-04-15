import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity()
export class InviteToken {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    email!: string;

    @Column({ unique: true })
    token!: string;

    @Column({ type: 'datetime' })
    expiresAt!: Date;

    @Column({ type: 'datetime', nullable: true })
    usedAt!: Date | null;

    @ManyToOne(() => User)
    createdBy!: User;

    @Column()
    createdById!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
