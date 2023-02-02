import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class CreateCreditCardDto {
  @Field(() => String)
  id: string;
}
