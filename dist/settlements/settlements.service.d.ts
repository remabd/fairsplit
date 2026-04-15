import { Repository } from 'typeorm';
import { Settlement, Expense, ExpenseSplit, SpaceParticipant } from '../entities/index.js';
export interface DebtEdge {
    from: string;
    fromName: string;
    to: string;
    toName: string;
    amount: number;
}
export interface BalanceSummary {
    userId: string;
    userName: string;
    balance: number;
}
export declare class SettlementsService {
    private settlementRepo;
    private expenseRepo;
    private splitRepo;
    private participantRepo;
    constructor(settlementRepo: Repository<Settlement>, expenseRepo: Repository<Expense>, splitRepo: Repository<ExpenseSplit>, participantRepo: Repository<SpaceParticipant>);
    createSettlement(spaceId: string, fromUserId: string, toUserId: string, amount: number): Promise<Settlement>;
    getSettlements(spaceId: string): Promise<Settlement[]>;
    getBalances(spaceId: string): Promise<BalanceSummary[]>;
    getSimplifiedDebts(spaceId: string): Promise<DebtEdge[]>;
    simplifyDebts(balances: BalanceSummary[]): DebtEdge[];
    deleteSettlement(settlementId: string): Promise<void>;
}
