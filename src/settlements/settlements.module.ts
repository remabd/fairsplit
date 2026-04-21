import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementsController } from './settlements.controller';
import { SettlementsService } from './settlements.service';
import {
    Settlement,
    Expense,
    ExpenseSplit,
    SpaceParticipant,
} from '../entities/index';

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
