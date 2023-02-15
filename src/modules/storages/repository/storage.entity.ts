import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { DepotEntity } from 'src/modules/depots';
import { IDepot } from 'src/modules/depots/depot.interface';
import { IStorage } from '../storage.interface';

export type StorageDocument = HydratedDocument<StorageEntity>;

@Schema({
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id: id, ...rest } = doc;
      return { id, rest };
    },
  },
})
export class StorageEntity implements IStorage {
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

export const StorageSchema = SchemaFactory.createForClass(StorageEntity);
