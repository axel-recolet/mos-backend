import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DocType } from 'src/utils/docType.enum';
import { IItem } from '../model/item.interface';
import { Unit } from '../model/unit.model';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item implements IItem {
  @Prop({ required: true })
  name: string;

  @Prop()
  cpf?: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  container: string;

  @Prop({ required: true })
  unit: Unit;

  @Prop({ required: true })
  docType: DocType.Item;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
