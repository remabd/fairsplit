import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Space } from './space.entity';
import { User } from './user.entity';
import { ExpenseSplit } from './expense-split.entity';
import { Category } from './category.entity';

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Space, (space) => space.expenses, { onDelete: 'CASCADE' })
    space!: Space;

    @Column()
    spaceId!: string;

    @ManyToOne(() => User)
    paidBy!: User;

    @Column()
    paidById!: string;

    @Column({ type: 'real' })
    amount!: number;

    @Column()
    description!: string;

    @ManyToOne(() => Category, (category) => category.expenses)
    category!: Category;

    @Column()
    categoryId!: string;

    @Column({ type: 'date' })
    date!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => ExpenseSplit, (split) => split.expense, { cascade: true })
    splits!: ExpenseSplit[];
}
