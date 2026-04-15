import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SpaceParticipant } from '../../entities/index.js';
export declare class SpaceMemberGuard implements CanActivate {
    private spaceParticipantRepo;
    constructor(spaceParticipantRepo: Repository<SpaceParticipant>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
