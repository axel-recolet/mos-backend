import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Unit {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  symbol: string;

  @Field(() => Float, { nullable: false })
  value: number;
}

export class Liter implements Unit {
  name: 'Liter';
  symbol: 'L';
  constructor(public value: number) {}
}
