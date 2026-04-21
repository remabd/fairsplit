import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Space, SpaceParticipant, User, UserRole } from '../entities/index';

const mockSpaceRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
});

const mockParticipantRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
});

const mockUserRepo = () => ({
    findOneBy: jest.fn(),
});

describe('SpacesService', () => {
    let service: SpacesService;
    let spaceRepo: ReturnType<typeof mockSpaceRepo>;
    let participantRepo: ReturnType<typeof mockParticipantRepo>;
    let userRepo: ReturnType<typeof mockUserRepo>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SpacesService,
                {
                    provide: getRepositoryToken(Space),
                    useFactory: mockSpaceRepo,
                },
                {
                    provide: getRepositoryToken(SpaceParticipant),
                    useFactory: mockParticipantRepo,
                },
                { provide: getRepositoryToken(User), useFactory: mockUserRepo },
            ],
        }).compile();

        service = module.get<SpacesService>(SpacesService);
        spaceRepo = module.get(getRepositoryToken(Space));
        participantRepo = module.get(getRepositoryToken(SpaceParticipant));
        userRepo = module.get(getRepositoryToken(User));
    });

    describe('create', () => {
        it('should create a space and add creator as participant', async () => {
            const space = { id: 'space-1', name: 'Home', currency: 'EUR' };
            spaceRepo.create.mockReturnValue(space);
            spaceRepo.save.mockResolvedValue(space);
            participantRepo.create.mockReturnValue({
                spaceId: 'space-1',
                userId: 'user-1',
            });
            participantRepo.save.mockResolvedValue({});

            const result = await service.create('Home', 'EUR', 'user-1');

            expect(result).toEqual(space);
            expect(participantRepo.create).toHaveBeenCalledWith({
                spaceId: 'space-1',
                userId: 'user-1',
            });
        });
    });

    describe('addParticipant', () => {
        it('should add a new participant', async () => {
            userRepo.findOneBy.mockResolvedValue({ id: 'user-2' });
            participantRepo.findOneBy.mockResolvedValue(null);
            participantRepo.create.mockReturnValue({
                spaceId: 'space-1',
                userId: 'user-2',
            });
            participantRepo.save.mockResolvedValue({
                spaceId: 'space-1',
                userId: 'user-2',
            });

            const result = await service.addParticipant('space-1', 'user-2');
            expect(result.userId).toBe('user-2');
        });

        it('should throw if user already active', async () => {
            userRepo.findOneBy.mockResolvedValue({ id: 'user-2' });
            participantRepo.findOneBy.mockResolvedValue({
                isActive: true,
            });

            await expect(
                service.addParticipant('space-1', 'user-2'),
            ).rejects.toThrow(ConflictException);
        });

        it('should reactivate a soft-deleted participant', async () => {
            userRepo.findOneBy.mockResolvedValue({ id: 'user-2' });
            const existing = { isActive: false, leftAt: new Date() };
            participantRepo.findOneBy.mockResolvedValue(existing);
            participantRepo.save.mockResolvedValue({
                ...existing,
                isActive: true,
                leftAt: null,
            });

            const result = await service.addParticipant('space-1', 'user-2');
            expect(result.isActive).toBe(true);
            expect(result.leftAt).toBeNull();
        });

        it('should throw if user not found', async () => {
            userRepo.findOneBy.mockResolvedValue(null);

            await expect(
                service.addParticipant('space-1', 'nonexistent'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('removeParticipant', () => {
        it('should soft-delete when admin requests', async () => {
            const admin = { id: 'admin-1', role: UserRole.ADMIN } as User;
            const participant = { isActive: true, leftAt: null };
            participantRepo.findOneBy.mockResolvedValue(participant);
            participantRepo.save.mockResolvedValue({});

            await service.removeParticipant('space-1', 'user-2', admin);

            expect(participant.isActive).toBe(false);
            expect(participant.leftAt).toBeInstanceOf(Date);
        });

        it('should deny non-admin', async () => {
            const member = { id: 'user-1', role: UserRole.MEMBER } as User;

            await expect(
                service.removeParticipant('space-1', 'user-2', member),
            ).rejects.toThrow(ForbiddenException);
        });
    });
});
