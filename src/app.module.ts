import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    User,
    Space,
    SpaceParticipant,
    Expense,
    ExpenseSplit,
    Settlement,
    InviteToken,
} from './entities/index.js';
import { AuthModule } from './auth/auth.module.js';
import { SpacesModule } from './spaces/spaces.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { SettlementsModule } from './settlements/settlements.module.js';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: process.env.DB_PATH ?? 'fairsplit.db',
            entities: [
                User,
                Space,
                SpaceParticipant,
                Expense,
                ExpenseSplit,
                Settlement,
                InviteToken,
            ],
            synchronize: true,
        }),
        AuthModule,
        SpacesModule,
        ExpensesModule,
        SettlementsModule,
    ],
})
export class AppModule {}
