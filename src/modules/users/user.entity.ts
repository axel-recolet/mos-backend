import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Email } from 'utils/email.type';
import { IDepot } from 'depots/depot.interface';
import { IUser } from './user.interface';
import { ICreditCard } from './creditCard.interface';

export class CreditCardEntity implements ICreditCard {
  @Prop({ required: true, type: String })
  id: string;
}

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id, ...rest } = ret;
      const id = _id.toString();
      return { id, ...rest };
    },
  },
})
export class UserEntity implements IUser {
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
    required: false,
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Depot',
      },
    ],
    default: [],
  })
  depots: IDepot[];

  @Prop({ required: false, type: CreditCardEntity, default: undefined })
  creditCard?: ICreditCard;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
