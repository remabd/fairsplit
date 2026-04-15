import { User } from './user.entity.js';
import { Space } from './space.entity.js';
export declare class SpaceParticipant {
    id: string;
    space: Space;
    spaceId: string;
    user: User;
    userId: string;
    isActive: boolean;
    joinedAt: Date;
    leftAt: Date | null;
}
