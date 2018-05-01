import { Document, Schema, Model, model } from 'mongoose';

export interface IBook extends Document {
  id: string;
  kind: string;
  etag: string;
  selfLink: string;
  accessInfo: object;
  saleInfo: object;
  searchInfo: object;
  volumeInfo: object;
}

export var BookSchema: Schema = new Schema({
  id: String,
  kind: String,
  etag: String,
  selfLink: String,
  accessInfo: Object,
  saleInfo: Object,
  searchInfo: Object,
  volumeInfo: Object
});

export const Book: Model<IBook> = model<IBook>('Book', BookSchema);
