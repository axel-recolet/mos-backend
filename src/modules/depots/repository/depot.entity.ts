import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { HydratedDocument } from 'mongoose';
import { Email } from 'src/utils/email.type';
import { IDepot } from '../depot.interface';

export type DepotDocument = HydratedDocument<Depot>;

@Schema({
  id: true,
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id, ...rest } = ret;
      return {
        id: _id.toString(),
        ...rest,
      };
    },
  },
  validateBeforeSave: true,
})
class Depot implements IDepot {
  id!: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, ref: 'User' })
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
    type: Date,
    required: true,
    transform: (value) => moment(value),
    toString() {
      return this.dueDate.format();
    },
  })
  dueDate: moment.Moment;
}

export { Depot as DepotEntity };

export const depotSchema = SchemaFactory.createForClass(Depot);
