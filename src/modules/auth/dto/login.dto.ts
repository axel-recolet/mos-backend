import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class LoginDto {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
}
