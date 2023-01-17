import { LeanDocument, Types } from 'mongoose';

export type Document<T> = LeanDocument<T> & {
  _id: Types.ObjectId;
};
