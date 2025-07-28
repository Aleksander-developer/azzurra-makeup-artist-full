// src/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

// Carica le variabili d'ambiente (dotenv dovrebbe essere già configurato in index.ts o db.config.ts)
// Se non lo è, assicurati che dotenv.config() sia chiamato all'inizio della tua applicazione.

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  // La chiave API sarà passata nell'header 'x-api-key'
  const apiKey = req.header('x-api-key');

  // Recupera la chiave API dal tuo ambiente (sarà impostata su Cloud Run)
  const expectedApiKey = process.env.API_KEY;

  // Se non c'è una chiave API nel backend (errore di configurazione)
  if (!expectedApiKey) {
    console.error('API_KEY non è definita nelle variabili d\'ambiente del server.');
    return res.status(500).json({ message: 'Errore di configurazione del server.' });
  }

  // Controlla se la chiave API fornita corrisponde a quella attesa
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ message: 'Accesso non autorizzato. Chiave API mancante o non valida.' });
  }

  // Se la chiave API è valida, prosegui con la prossima funzione middleware/route handler
  next();
};