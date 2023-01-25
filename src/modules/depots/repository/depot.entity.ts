import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { IUser } from 'src/modules/users/user.interface';
import { IDepot } from '../depot.interface';

export type DepotDocument = HydratedDocument<DepotEntity>;

@Schema({
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id: id, ...rest } = doc;
      return {
        id,
        rest,
      };
    },
  },
})
export class DepotEntity implements IDepot {
  id!: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  admins: IUser[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  users: IUser[];
}

export const depotSchema = SchemaFactory.createForClass(DepotEntity);
