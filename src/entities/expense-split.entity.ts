import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from './user.entity';

@Entity()
export class ExpenseSplit {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Expense, (expense) => expense.splits, {
        onDelete: 'CASCADE',
    })
    expense!: Expense;

    @Column()
    expenseId!: string;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    userId!: string;

    @Column({ type: 'real' })
    percentage!: number;

    @Column({ type: 'real' })
    amount!: number;
}
