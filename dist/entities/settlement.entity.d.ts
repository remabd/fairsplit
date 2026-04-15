import { Space } from './space.entity.js';
import { User } from './user.entity.js';
export declare class Settlement {
    id: string;
    space: Space;
    spaceId: string;
    fromUser: User;
    fromUserId: string;
    toUser: User;
    toUserId: string;
    amount: number;
    createdAt: Date;
}
