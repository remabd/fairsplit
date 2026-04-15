import { SpacesService } from './spaces.service.js';
import { CreateSpaceDto } from './dto/create-space.dto.js';
import { AddParticipantDto } from './dto/add-participant.dto.js';
import { User } from '../entities/index.js';
export declare class SpacesController {
    private spacesService;
    constructor(spacesService: SpacesService);
    create(dto: CreateSpaceDto, user: User): Promise<import("../entities/space.entity.js").Space>;
    findAll(user: User): Promise<import("../entities/space.entity.js").Space[]>;
    findOne(spaceId: string): Promise<import("../entities/space.entity.js").Space>;
    addParticipant(spaceId: string, dto: AddParticipantDto): Promise<import("../entities/space-participant.entity.js").SpaceParticipant>;
    removeParticipant(spaceId: string, userId: string, user: User): Promise<void>;
}
