// api/src/config/db.config.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Importa dotenv

dotenv.config(); // Carica le variabili d'ambiente

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI non definita nelle variabili d'ambiente.");
    await mongoose.connect(uri);
    console.log(' Connesso a MongoDB Atlas');
  } catch (error) {
    console.error(' Errore di connessione a MongoDB:', error);
    process.exit(1); // Termina il processo se la connessione fallisce
  }
};

