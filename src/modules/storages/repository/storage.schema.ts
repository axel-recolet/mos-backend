import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { IDepot } from 'src/modules/depots/depot.interface';
import { IStorage } from '../model';

export type StorageDocument = HydratedDocument<Storage>;

@Schema({
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id: id, ...rest } = doc;
      return { id, rest };
    },
  },
})
export class Storage implements IStorage {
  id!: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true, type: Number })
  fillRate: number;

  @Prop({ type: String })
  comment?: string;

  @Prop({
    required: false,
    type: [{ type: Types.ObjectId, ref: 'Storage' }],
  })
  containedIns?: Storage[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Depot' })
  depot: IDepot;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
