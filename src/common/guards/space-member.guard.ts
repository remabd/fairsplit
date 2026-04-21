import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { SpaceParticipant, type User } from '../../entities/index';

@Injectable()
export class SpaceMemberGuard implements CanActivate {
    constructor(
        @InjectRepository(SpaceParticipant)
        private spaceParticipantRepo: Repository<SpaceParticipant>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Request & { user: User }>();
        const user = request.user;
        const spaceId =
            (request.params as Record<string, string>).spaceId ??
            (request.body as Record<string, string>).spaceId;

        if (!spaceId) throw new ForbiddenException('Space ID required');

        const participant = await this.spaceParticipantRepo.findOneBy({
            spaceId,
            userId: user.id,
            isActive: true,
        });

        if (!participant) {
            throw new ForbiddenException('You are not a member of this space');
        }

        return true;
    }
}
