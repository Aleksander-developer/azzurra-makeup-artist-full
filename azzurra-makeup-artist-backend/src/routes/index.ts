// src/routes/index.ts
import express from 'express';
import chiSonoRoutes from './chi-sono.routes';
import contattiRoutes from './contatti.routes';
import serviziRoutes from './servizi.routes';
import portfolioRoutes from './portfolio.routes'; // <-- NUOVO: Importa le rotte del portfolio

const router = express.Router();

router.use('/chi-sono', chiSonoRoutes);
router.use('/contatti', contattiRoutes);
router.use('/servizi', serviziRoutes);
router.use('/portfolio', portfolioRoutes); // <-- NUOVO: Aggiungi le rotte del portfolio

// Puoi aggiungere qui una rotta per il login/autenticazione in futuro
// router.use('/auth', authRoutes);

export default router;

