import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Space } from './space.entity';

@Entity()
export class SpaceParticipant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Space, (space) => space.participants, {
        onDelete: 'CASCADE',
    })
    space!: Space;

    @Column()
    spaceId!: string;

    @ManyToOne(() => User, (user) => user.spaceParticipants)
    user!: User;

    @Column()
    userId!: string;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    joinedAt!: Date;

    @Column({ type: 'datetime', nullable: true })
    leftAt!: Date | null;
}
