import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const cxt = GqlExecutionContext.create(context);
    const { user } = cxt.getContext().req;
    return user;
  },
);
