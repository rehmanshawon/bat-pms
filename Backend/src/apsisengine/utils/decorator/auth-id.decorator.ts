import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user_data = request.user ?? '';

    return user_data.user_id ?? '';
  },
);
