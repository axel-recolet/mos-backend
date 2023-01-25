import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Email } from 'utils/email.type';
import { IDepot } from 'depots/depot.interface';
import { IUser } from './user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id: id, ...rest } = doc;
      return { id, rest };
    },
  },
})
export class User implements IUser {
  id: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (_) => isEmail(_),
      message: (e) => `${e} is not an Email`,
    },
  })
  email: Email;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Depot',
      },
    ],
  })
  depots: IDepot[];
}

export const UserSchema = SchemaFactory.createForClass(User);
