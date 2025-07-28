// api/src/controllers/chi-sono.controller.ts
import { Request, Response } from 'express';
import { ChiSono } from '../models/chisono.model'; // Percorso corretto

export const getProfilo = async (_req: Request, res: Response) => {
  try {
    const contenuto = await ChiSono.findOne();
    res.json(contenuto);
  } catch (error) {
    res.status(500).json({ message: 'Errore caricamento profilo', error });
  }
};

