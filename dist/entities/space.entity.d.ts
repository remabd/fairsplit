import { SpaceParticipant } from './space-participant.entity.js';
import { Expense } from './expense.entity.js';
import { Settlement } from './settlement.entity.js';
export declare class Space {
    id: string;
    name: string;
    currency: string;
    createdAt: Date;
    participants: SpaceParticipant[];
    expenses: Expense[];
    settlements: Settlement[];
}
