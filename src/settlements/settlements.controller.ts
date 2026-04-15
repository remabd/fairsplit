import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettlementsService } from './settlements.service.js';
import { CreateSettlementDto } from './dto/create-settlement.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SpaceMemberGuard } from '../common/guards/space-member.guard.js';
import { User } from '../entities/index.js';

@Controller('spaces/:spaceId/settlements')
@UseGuards(AuthGuard('jwt'), SpaceMemberGuard)
export class SettlementsController {
    constructor(private settlementsService: SettlementsService) {}

    @Post()
    create(
        @Param('spaceId') spaceId: string,
        @Body() dto: CreateSettlementDto,
        @CurrentUser() user: User,
    ) {
        return this.settlementsService.createSettlement(
            spaceId,
            user.id,
            dto.toUserId,
            dto.amount,
        );
    }

    @Get()
    findAll(@Param('spaceId') spaceId: string) {
        return this.settlementsService.getSettlements(spaceId);
    }

    @Get('balances')
    getBalances(@Param('spaceId') spaceId: string) {
        return this.settlementsService.getBalances(spaceId);
    }

    @Get('debts')
    getSimplifiedDebts(@Param('spaceId') spaceId: string) {
        return this.settlementsService.getSimplifiedDebts(spaceId);
    }

    @Delete(':settlementId')
    delete(@Param('settlementId') settlementId: string) {
        return this.settlementsService.deleteSettlement(settlementId);
    }
}
