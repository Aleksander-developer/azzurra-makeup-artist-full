// src/models/chisono.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IChiSono extends Document {
  contenuto: string;
  aggiornata: Date;
}

const chiSonoSchema: Schema = new Schema({
  contenuto: { type: String, required: true },
  aggiornata: { type: Date, default: Date.now }
});

export const ChiSono = mongoose.model<IChiSono>('ChiSono', chiSonoSchema);

