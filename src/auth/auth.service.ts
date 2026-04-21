import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { User, UserRole, InviteToken } from '../entities/index';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(InviteToken)
        private inviteTokenRepo: Repository<InviteToken>,
        private jwtService: JwtService,
    ) {}

    async register(
        email: string,
        name: string,
        password: string,
    ): Promise<{ accessToken: string }> {
        const existing = await this.userRepo.findOneBy({ email });
        if (existing) throw new ConflictException('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 10);

        const isFirstUser = (await this.userRepo.count()) === 0;

        const user = this.userRepo.create({
            email,
            name,
            password: hashedPassword,
            role: isFirstUser ? UserRole.ADMIN : UserRole.MEMBER,
            isActive: true,
        });
        await this.userRepo.save(user);

        return this.generateToken(user);
    }

    async login(
        email: string,
        password: string,
    ): Promise<{ accessToken: string }> {
        const user = await this.userRepo.findOneBy({ email });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    async createInvite(
        email: string,
        createdById: string,
    ): Promise<{ token: string; email: string }> {
        const existing = await this.userRepo.findOneBy({ email });
        if (existing?.isActive) {
            throw new ConflictException('User with this email already exists');
        }

        // Create inactive user placeholder if not exists
        if (!existing) {
            const user = this.userRepo.create({
                email,
                role: UserRole.MEMBER,
                isActive: false,
            });
            await this.userRepo.save(user);
        }

        const token = randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invite = this.inviteTokenRepo.create({
            email,
            token,
            expiresAt,
            createdById,
        });
        await this.inviteTokenRepo.save(invite);

        return { token, email };
    }

    async acceptInvite(
        token: string,
        name: string,
        password: string,
    ): Promise<{ accessToken: string }> {
        const invite = await this.inviteTokenRepo.findOneBy({ token });
        if (!invite) throw new BadRequestException('Invalid invite token');
        if (invite.usedAt) throw new BadRequestException('Invite already used');
        if (new Date() > invite.expiresAt)
            throw new BadRequestException('Invite expired');

        const user = await this.userRepo.findOneBy({ email: invite.email });
        if (!user) throw new BadRequestException('User not found');

        user.name = name;
        user.password = await bcrypt.hash(password, 10);
        user.isActive = true;
        await this.userRepo.save(user);

        invite.usedAt = new Date();
        await this.inviteTokenRepo.save(invite);

        return this.generateToken(user);
    }

    private generateToken(user: User): { accessToken: string } {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { accessToken: this.jwtService.sign(payload) };
    }
}
