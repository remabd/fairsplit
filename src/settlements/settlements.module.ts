import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementsController } from './settlements.controller.js';
import { SettlementsService } from './settlements.service.js';
import {
    Settlement,
    Expense,
    ExpenseSplit,
    SpaceParticipant,
} from '../entities/index.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Settlement,
            Expense,
            ExpenseSplit,
            SpaceParticipant,
        ]),
    ],
    controllers: [SettlementsController],
    providers: [SettlementsService],
    exports: [SettlementsService],
})
export class SettlementsModule {}
