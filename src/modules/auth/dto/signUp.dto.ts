import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateDepotDto } from 'src/modules/depots/dto';

@InputType()
@ArgsType()
export class SignupDto {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => CreateDepotDto, { defaultValue: false })
  @ValidateNested()
  createDepot?: CreateDepotDto;

  @Field(() => [String], { nullable: true })
  depotsLinks?: string[];
}
