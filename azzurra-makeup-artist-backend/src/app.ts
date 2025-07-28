// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.config';
import apiRoutes from './routes';
// import path from 'path'; // Rimosso: non più necessario per servire uploads statici

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://azzurra-makeup-artist.netlify.app', // Questo sarà l'URL del tuo frontend su Cloud Run
  'http://localhost:4200', // Per lo sviluppo locale di Angular
  'http://localhost:3000' // Per il backend stesso se fai richieste interne
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("CORS origin non permessa:", origin);
    return callback(new Error('Accesso CORS non consentito da questo dominio'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware per il parsing del body delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rimosso: Non servire più i file statici dalla cartella 'uploads'
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRoutes);

(async () => { await connectDB(); })();

// Rotta di base per testare che il server sia attivo
app.get('/', (req, res) => {
  res.send('Server Express per Azzurra Makeup Artist avviato con successo!');
});

export default app;

