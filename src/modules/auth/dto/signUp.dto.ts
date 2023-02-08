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
}
