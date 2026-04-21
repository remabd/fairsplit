import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense, ExpenseSplit, SpaceParticipant } from '../entities/index';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense, ExpenseSplit, SpaceParticipant]),
    ],
    controllers: [ExpensesController],
    providers: [ExpensesService],
    exports: [ExpensesService],
})
export class ExpensesModule {}
