import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SpaceMemberGuard } from '../common/guards/space-member.guard';
import { User } from '../entities/index';

@Controller('spaces/:spaceId/expenses')
@UseGuards(AuthGuard('jwt'), SpaceMemberGuard)
export class ExpensesController {
    constructor(private expensesService: ExpensesService) {}

    @Post()
    create(
        @Param('spaceId') spaceId: string,
        @Body() dto: CreateExpenseDto,
        @CurrentUser() user: User,
    ) {
        return this.expensesService.create(
            spaceId,
            user.id,
            dto.amount,
            dto.description,
            dto.categoryId,
            dto.date,
            dto.splits,
        );
    }

    @Get()
    findAll(@Param('spaceId') spaceId: string) {
        return this.expensesService.findAllBySpace(spaceId);
    }

    @Get(':expenseId')
    findOne(@Param('expenseId') expenseId: string) {
        return this.expensesService.findOne(expenseId);
    }

    @Put(':expenseId')
    update(
        @Param('expenseId') expenseId: string,
        @Body() dto: UpdateExpenseDto,
        @CurrentUser() user: User,
    ) {
        return this.expensesService.update(expenseId, user, dto);
    }

    @Delete(':expenseId')
    delete(@Param('expenseId') expenseId: string, @CurrentUser() user: User) {
        return this.expensesService.delete(expenseId, user);
    }
}
