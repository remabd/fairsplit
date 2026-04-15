import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { InviteDto } from './dto/invite.dto.js';
import { AcceptInviteDto } from './dto/accept-invite.dto.js';
import { User } from '../entities/index.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    invite(dto: InviteDto, user: User): Promise<{
        token: string;
        email: string;
    }>;
    acceptInvite(dto: AcceptInviteDto): Promise<{
        accessToken: string;
    }>;
}
