// src/routes/servizi.routes.ts
import express from 'express';
import { getServizi } from '../controllers/servizi.controller';

const router = express.Router();

router.get('/', getServizi);

export default router;

