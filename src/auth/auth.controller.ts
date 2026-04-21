import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InviteDto } from './dto/invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/guards/roles.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { User, UserRole } from '../entities/index';

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
