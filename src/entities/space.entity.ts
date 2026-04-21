import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { SpaceParticipant } from './space-participant.entity';
import { Expense } from './expense.entity';
import { Settlement } from './settlement.entity';

@Entity()
export class Space {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ default: 'EUR' })
    currency!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => SpaceParticipant, (sp) => sp.space)
    participants!: SpaceParticipant[];

    @OneToMany(() => Expense, (e) => e.space)
    expenses!: Expense[];

    @OneToMany(() => Settlement, (s) => s.space)
    settlements!: Settlement[];
}
