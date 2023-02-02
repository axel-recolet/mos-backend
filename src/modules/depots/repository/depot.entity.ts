import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment, { Moment } from 'moment';
import { Types, HydratedDocument } from 'mongoose';
import { UserEntity } from 'src/modules/users';
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
  @Prop({ _id: true })
  id!: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
  creator: IUser;

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

  @Prop({
    type: String,
    required: true,
    transform: (value) => moment(value),
  })
  dueDate: Moment;
}

export const depotSchema = SchemaFactory.createForClass(DepotEntity);
