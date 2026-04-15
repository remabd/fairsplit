import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space, SpaceParticipant, User, UserRole } from '../entities/index.js';

@Injectable()
export class SpacesService {
    constructor(
        @InjectRepository(Space)
        private spaceRepo: Repository<Space>,
        @InjectRepository(SpaceParticipant)
        private participantRepo: Repository<SpaceParticipant>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(
        name: string,
        currency: string,
        creatorId: string,
    ): Promise<Space> {
        const space = this.spaceRepo.create({ name, currency });
        await this.spaceRepo.save(space);

        // Auto-add creator as participant
        const participant = this.participantRepo.create({
            spaceId: space.id,
            userId: creatorId,
        });
        await this.participantRepo.save(participant);

        return space;
    }

    async findAllForUser(userId: string): Promise<Space[]> {
        const participations = await this.participantRepo.find({
            where: { userId, isActive: true },
            relations: ['space'],
        });
        return participations.map((p) => p.space);
    }

    async findOne(spaceId: string): Promise<Space> {
        const space = await this.spaceRepo.findOne({
            where: { id: spaceId },
            relations: ['participants', 'participants.user'],
        });
        if (!space) throw new NotFoundException('Space not found');
        return space;
    }

    async addParticipant(
        spaceId: string,
        userId: string,
    ): Promise<SpaceParticipant> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        const existing = await this.participantRepo.findOneBy({
            spaceId,
            userId,
        });

        if (existing) {
            if (existing.isActive) {
                throw new ConflictException('User is already a participant');
            }
            // Reactivate
            existing.isActive = true;
            existing.leftAt = null;
            return this.participantRepo.save(existing);
        }

        const participant = this.participantRepo.create({ spaceId, userId });
        return this.participantRepo.save(participant);
    }

    async removeParticipant(
        spaceId: string,
        userId: string,
        requestingUser: User,
    ): Promise<void> {
        if (requestingUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admin can remove participants');
        }

        const participant = await this.participantRepo.findOneBy({
            spaceId,
            userId,
            isActive: true,
        });

        if (!participant) {
            throw new NotFoundException('Participant not found');
        }

        participant.isActive = false;
        participant.leftAt = new Date();
        await this.participantRepo.save(participant);
    }
}
