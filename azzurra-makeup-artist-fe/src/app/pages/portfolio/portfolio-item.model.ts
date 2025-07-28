// src/app/models/portfolio-item.model.ts

export interface PortfolioImage {
  src: string | undefined; // URL dell'immagine (se già caricata)
  description?: string;   // Descrizione dell'immagine (opzionale)
  alt?: string;           // Testo alternativo per accessibilità (opzionale)
  isNew?: boolean;        // Indica se l'immagine è nuova e deve essere caricata
  file?: File;            // <-- AGGIUNTO: Il file effettivo (solo se isNew è true)
}

export interface PortfolioItem {
  id?: string; // ID Firestore del documento
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  images: PortfolioImage[]; // Array di immagini per il portfolio item
  coverImageUrl?: string; // URL dell'immagine di copertina (calcolata o scelta)
  createdAt?: Date; // Data di creazione (Firestore Timestamp)
  updatedAt?: Date; // Data di ultimo aggiornamento (Firestore Timestamp)
}
