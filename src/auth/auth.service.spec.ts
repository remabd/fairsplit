import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, UserRole, InviteToken } from '../entities/index';

const mockUserRepo = () => ({
    findOneBy: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

const mockInviteTokenRepo = () => ({
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

const mockJwtService = () => ({
    sign: jest.fn().mockReturnValue('test-token'),
});

describe('AuthService', () => {
    let service: AuthService;
    let userRepo: ReturnType<typeof mockUserRepo>;
    let jwtService: ReturnType<typeof mockJwtService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useFactory: mockUserRepo },
                {
                    provide: getRepositoryToken(InviteToken),
                    useFactory: mockInviteTokenRepo,
                },
                { provide: JwtService, useFactory: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepo = module.get(getRepositoryToken(User));
        jwtService = module.get(JwtService);
    });

    describe('register', () => {
        it('should create the first user as admin', async () => {
            userRepo.findOneBy.mockResolvedValue(null);
            userRepo.count.mockResolvedValue(0);
            userRepo.create.mockImplementation((data: Partial<User>) => data);
            userRepo.save.mockImplementation((user: Partial<User>) => ({
                ...user,
                id: 'user-1',
            }));

            const result = await service.register(
                'admin@test.com',
                'Admin',
                'password123',
            );

            expect(result.accessToken).toBe('test-token');
            expect(userRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({ role: UserRole.ADMIN }),
            );
        });

        it('should create subsequent users as member', async () => {
            userRepo.findOneBy.mockResolvedValue(null);
            userRepo.count.mockResolvedValue(1);
            userRepo.create.mockImplementation((data: Partial<User>) => data);
            userRepo.save.mockImplementation((user: Partial<User>) => ({
                ...user,
                id: 'user-2',
            }));

            await service.register('member@test.com', 'Member', 'password123');

            expect(userRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({ role: UserRole.MEMBER }),
            );
        });

        it('should throw ConflictException if email exists', async () => {
            userRepo.findOneBy.mockResolvedValue({ id: 'existing' });

            await expect(
                service.register('taken@test.com', 'Name', 'password123'),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should return token for valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            userRepo.findOneBy.mockResolvedValue({
                id: 'user-1',
                email: 'test@test.com',
                password: hashedPassword,
                isActive: true,
                role: UserRole.MEMBER,
            });

            const result = await service.login('test@test.com', 'password123');
            expect(result.accessToken).toBe('test-token');
            expect(jwtService.sign).toHaveBeenCalled();
        });

        it('should throw for invalid password', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            userRepo.findOneBy.mockResolvedValue({
                id: 'user-1',
                email: 'test@test.com',
                password: hashedPassword,
                isActive: true,
            });

            await expect(
                service.login('test@test.com', 'wrongpassword'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw for non-existent user', async () => {
            userRepo.findOneBy.mockResolvedValue(null);

            await expect(
                service.login('nobody@test.com', 'password123'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw for inactive user', async () => {
            userRepo.findOneBy.mockResolvedValue({
                id: 'user-1',
                email: 'test@test.com',
                isActive: false,
            });

            await expect(
                service.login('test@test.com', 'password123'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
