import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller.js';
import { ExpensesService } from './expenses.service.js';
import { Expense, ExpenseSplit, SpaceParticipant } from '../entities/index.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense, ExpenseSplit, SpaceParticipant]),
    ],
    controllers: [ExpensesController],
    providers: [ExpensesService],
    exports: [ExpensesService],
})
export class ExpensesModule {}
