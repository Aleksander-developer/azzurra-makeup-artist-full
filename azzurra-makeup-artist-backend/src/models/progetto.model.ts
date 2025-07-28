// src/models/progetto.model.ts (Ora PortfolioItem)
import mongoose, { Document, Schema } from 'mongoose';

// Interfaccia per le immagini della galleria
export interface IPortfolioImage {
  src: string;
  description?: string;
  alt?: string;
  isNew?: boolean; // <-- AGGIUNTO: Indica se l'immagine è stata appena caricata
}

// Interfaccia per l'elemento del portfolio
export interface IPortfolioItem extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  mainImage: string; // URL dell'immagine principale
  category: string;
  images?: IPortfolioImage[]; // Array di immagini della galleria
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioImageSchema: Schema = new Schema({
  src: { type: String, required: true },
  description: { type: String },
  alt: { type: String }
}, { _id: false }); // _id: false per evitare che MongoDB crei un _id per ogni sub-documento

const PortfolioItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  mainImage: { type: String, required: true },
  category: { type: String, required: true },
  images: [PortfolioImageSchema] // Array di sub-documenti PortfolioImage
}, {
  timestamps: true // Aggiunge automaticamente createdAt e updatedAt
});

export const PortfolioItem = mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);

