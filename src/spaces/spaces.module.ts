import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesController } from './spaces.controller.js';
import { SpacesService } from './spaces.service.js';
import { Space, SpaceParticipant, User } from '../entities/index.js';

@Module({
    imports: [TypeOrmModule.forFeature([Space, SpaceParticipant, User])],
    controllers: [SpacesController],
    providers: [SpacesService],
    exports: [SpacesService],
})
export class SpacesModule {}
