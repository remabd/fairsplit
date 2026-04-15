import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { User } from '../entities/index.js';
interface JwtPayload {
    sub: string;
    email: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepo;
    constructor(userRepo: Repository<User>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
