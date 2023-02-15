import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import { CreateDepotDto } from './createDepot.dto';

@ArgsType()
@InputType()
export class UpdateDepotDto extends PartialType(CreateDepotDto) {}
