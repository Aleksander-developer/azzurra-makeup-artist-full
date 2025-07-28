// src/models/servizio.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IServizio extends Document {
  title: string;
  description?: string;
  icon?: string;
}

const servizioSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String }
});

export const Servizio = mongoose.model<IServizio>('Servizio', servizioSchema);

