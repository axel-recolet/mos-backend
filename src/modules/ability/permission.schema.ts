import { Prop, Schema } from '@nestjs/mongoose';
import { Action } from './action.enum';

@Schema()
export class Permission {
  @Prop({ type: [String], required: true, enum: Action })
  default: Action[];
  @Prop({ type: Map, of: String, required: true })
  byUser: Record<string, Action[]>;
}
