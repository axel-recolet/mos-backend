import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { IDepot } from 'src/modules/depots/depot.interface';
import { IStorage } from 'storages/storage.interface';
import { IItem } from '../model/item.interface';
import { Unit } from '../model/unit.model';

export type ItemDocument = HydratedDocument<Item>;

@Schema({
  toObject: {
    versionKey: false,
    transform(doc, ret, options) {
      const { _id: id, ...rest } = doc;
      return { id, rest };
    },
  },
})
export class Item implements IItem {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  cpf?: string;

  @Prop({ type: String, required: true })
  brand: string;

  @Prop({ type: String, required: true })
  container: string;

  @Prop({ type: String, required: true })
  unit: Unit;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Storage' }] })
  containedIns: IStorage[];

  @Prop({ required: true, type: Types.ObjectId })
  depot: IDepot;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
