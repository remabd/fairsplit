import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Space } from './space.entity.js';
import { User } from './user.entity.js';

@Entity()
export class Settlement {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Space, (space) => space.settlements, {
        onDelete: 'CASCADE',
    })
    space!: Space;

    @Column()
    spaceId!: string;

    @ManyToOne(() => User)
    fromUser!: User;

    @Column()
    fromUserId!: string;

    @ManyToOne(() => User)
    toUser!: User;

    @Column()
    toUserId!: string;

    @Column({ type: 'real' })
    amount!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
