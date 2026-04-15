import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { InviteDto } from './dto/invite.dto.js';
import { AcceptInviteDto } from './dto/accept-invite.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/guards/roles.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { User, UserRole } from '../entities/index.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.name, dto.password);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('invite')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    invite(@Body() dto: InviteDto, @CurrentUser() user: User) {
        return this.authService.createInvite(dto.email, user.id);
    }

    @Post('accept-invite')
    acceptInvite(@Body() dto: AcceptInviteDto) {
        return this.authService.acceptInvite(dto.token, dto.name, dto.password);
    }
}
