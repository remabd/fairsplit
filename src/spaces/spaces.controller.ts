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
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles, RolesGuard } from '../common/guards/roles.guard';
import { SpaceMemberGuard } from '../common/guards/space-member.guard';
import { User, UserRole } from '../entities/index';

@Controller('spaces')
@UseGuards(AuthGuard('jwt'))
export class SpacesController {
    constructor(private spacesService: SpacesService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateSpaceDto, @CurrentUser() user: User) {
        return this.spacesService.create(
            dto.name,
            dto.currency ?? 'EUR',
            user.id,
        );
    }

    @Get()
    findAll(@CurrentUser() user: User) {
        return this.spacesService.findAllForUser(user.id);
    }

    @Get(':spaceId')
    @UseGuards(SpaceMemberGuard)
    findOne(@Param('spaceId') spaceId: string) {
        return this.spacesService.findOne(spaceId);
    }

    @Post(':spaceId/participants')
    @UseGuards(SpaceMemberGuard)
    addParticipant(
        @Param('spaceId') spaceId: string,
        @Body() dto: AddParticipantDto,
    ) {
        return this.spacesService.addParticipant(spaceId, dto.userId);
    }

    @Delete(':spaceId/participants/:userId')
    @UseGuards(SpaceMemberGuard)
    removeParticipant(
        @Param('spaceId') spaceId: string,
        @Param('userId') userId: string,
        @CurrentUser() user: User,
    ) {
        return this.spacesService.removeParticipant(spaceId, userId, user);
    }
}
