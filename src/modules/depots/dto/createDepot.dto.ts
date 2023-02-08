import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Email } from 'utils/email.type';

@ArgsType()
@InputType()
export class CreateDepotDto {
  @Field(() => [String])
  @IsEmail(
    {},
    {
      each: true,
    },
  )
  admins: Email[];

  @Field(() => [String], { defaultValue: [] })
  @IsEmail(
    {},
    {
      each: true,
    },
  )
  users: Email[];

  @Field(() => String)
  name: string;
}
