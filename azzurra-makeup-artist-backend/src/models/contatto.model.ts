// src/models/contatto.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContatto extends Document {
  nome: string;
  email: string;
  messaggio: string;
  cellulare?: string;
  data: Date;
}

const contattoSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  messaggio: { type: String, required: true },
  cellulare: { type: String },
  data: { type: Date, default: Date.now }
});

export const Contatto = mongoose.model<IContatto>('Contatto', contattoSchema);

