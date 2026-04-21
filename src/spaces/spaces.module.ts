import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { Space, SpaceParticipant, User } from '../entities/index';

@Module({
    imports: [TypeOrmModule.forFeature([Space, SpaceParticipant, User])],
    controllers: [SpacesController],
    providers: [SpacesService],
    exports: [SpacesService],
})
export class SpacesModule {}
