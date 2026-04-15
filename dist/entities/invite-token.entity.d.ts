import { User } from './user.entity.js';
export declare class InviteToken {
    id: string;
    email: string;
    token: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdBy: User;
    createdById: string;
    createdAt: Date;
}
