// src/routes/chi-sono.routes.ts
import express from 'express';
import { getProfilo } from '../controllers/chi-sono.controller';

const router = express.Router();

router.get('/', getProfilo);

export default router;

