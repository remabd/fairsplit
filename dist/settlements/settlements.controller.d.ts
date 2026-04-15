import { SettlementsService } from './settlements.service.js';
import { CreateSettlementDto } from './dto/create-settlement.dto.js';
import { User } from '../entities/index.js';
export declare class SettlementsController {
    private settlementsService;
    constructor(settlementsService: SettlementsService);
    create(spaceId: string, dto: CreateSettlementDto, user: User): Promise<import("../entities/settlement.entity.js").Settlement>;
    findAll(spaceId: string): Promise<import("../entities/settlement.entity.js").Settlement[]>;
    getBalances(spaceId: string): Promise<import("./settlements.service.js").BalanceSummary[]>;
    getSimplifiedDebts(spaceId: string): Promise<import("./settlements.service.js").DebtEdge[]>;
    delete(settlementId: string): Promise<void>;
}
