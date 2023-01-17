import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DocType } from '../../../utils/docType.enum';
import { IStorage } from '../model';

export type StorageDocument = HydratedDocument<Storage>;

@Schema()
export class Storage implements IStorage {
  @Prop({ required: true })
  docType: DocType.Storage;

  @Prop({ type: String })
  name?: string;

  @Prop({ required: true, type: Number })
  fillRate: number;

  @Prop({ type: String })
  comment?: string;

  @Prop({ required: false, type: mongoose.Types.ObjectId, ref: 'Storage' })
  containedIn?: Storage;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
