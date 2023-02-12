import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { HydratedDocument } from 'mongoose';
import { Email } from 'src/utils/email.type';
import { IDepot } from '../depot.interface';

export type DepotDocument = HydratedDocument<DepotEntity>;

@Schema({
  id: true,
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id: id, ...rest } = ret;
      return {
        id,
        ...rest,
      };
    },
  },
})
export class DepotEntity implements IDepot {
  @Prop({ type: String })
  id!: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, ref: 'User', unique: true })
  creator: string;

  @Prop({
    type: [{ type: String, ref: 'User' }],
    required: true,
  })
  admins: Email[];

  @Prop({
    type: [{ type: String, ref: 'User' }],
    required: true,
  })
  users: Email[];

  @Prop({
    type: String,
    required: true,
    transform: (value) => moment(value),
  })
  dueDate: moment.Moment;
}

export const depotSchema = SchemaFactory.createForClass(DepotEntity);
