// src/routes/contatti.routes.ts
import express from 'express';
import { inviaMessaggio } from '../controllers/contatti.controller';

const router = express.Router();

router.post('/', (req, res, next) => {
  // Assicurati che inviaMessaggio sia una funzione asincrona
  inviaMessaggio(req, res).catch(next);
});

export default router;

