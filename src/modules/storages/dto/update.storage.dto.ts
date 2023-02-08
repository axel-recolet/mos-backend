import { ArgsType, Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class UpdateStorageDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  fillRate?: number;

  @Field(() => String, { nullable: true })
  comment?: string;

  @Field(() => ID, { nullable: true })
  containedIn?: string | null;

  @Field(() => ID, { nullable: true })
  depot?: string;
}
