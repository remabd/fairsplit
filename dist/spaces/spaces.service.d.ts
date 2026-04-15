import { Repository } from 'typeorm';
import { Space, SpaceParticipant, User } from '../entities/index.js';
export declare class SpacesService {
    private spaceRepo;
    private participantRepo;
    private userRepo;
    constructor(spaceRepo: Repository<Space>, participantRepo: Repository<SpaceParticipant>, userRepo: Repository<User>);
    create(name: string, currency: string, creatorId: string): Promise<Space>;
    findAllForUser(userId: string): Promise<Space[]>;
    findOne(spaceId: string): Promise<Space>;
    addParticipant(spaceId: string, userId: string): Promise<SpaceParticipant>;
    removeParticipant(spaceId: string, userId: string, requestingUser: User): Promise<void>;
}
