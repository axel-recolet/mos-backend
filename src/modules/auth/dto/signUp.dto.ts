import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateDepotDto } from 'src/modules/depots/dto';
import { CreateCreditCardDto } from './creditCard.dto';

@InputType()
@ArgsType()
export class SignupDto {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => CreateCreditCardDto, { nullable: true })
  creditCard?: CreateCreditCardDto;

  @Field(() => CreateDepotDto, { nullable: true, defaultValue: true })
  @ValidateNested()
  createDepot?: CreateDepotDto;

  @Field(() => [String], { nullable: true })
  depotsLinks?: string[];
}
