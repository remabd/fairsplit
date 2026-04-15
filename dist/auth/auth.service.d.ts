import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, InviteToken } from '../entities/index.js';
export declare class AuthService {
    private userRepo;
    private inviteTokenRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, inviteTokenRepo: Repository<InviteToken>, jwtService: JwtService);
    register(email: string, name: string, password: string): Promise<{
        accessToken: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    createInvite(email: string, createdById: string): Promise<{
        token: string;
        email: string;
    }>;
    acceptInvite(token: string, name: string, password: string): Promise<{
        accessToken: string;
    }>;
    private generateToken;
}
