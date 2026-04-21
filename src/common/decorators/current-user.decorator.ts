import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '../../entities/index';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User => {
        const request = ctx
            .switchToHttp()
            .getRequest<Request & { user: User }>();
        return request.user;
    },
);
