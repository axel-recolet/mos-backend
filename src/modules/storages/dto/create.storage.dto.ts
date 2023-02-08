import { ArgsType, Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class CreateStorageDto {
  @Field()
  name: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  fillRate: number;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => ID, { nullable: true })
  containedIn?: string;

  @Field(() => ID)
  depot: string;
}
