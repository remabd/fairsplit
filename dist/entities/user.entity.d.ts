import { SpaceParticipant } from './space-participant.entity.js';
export declare enum UserRole {
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    spaceParticipants: SpaceParticipant[];
}
