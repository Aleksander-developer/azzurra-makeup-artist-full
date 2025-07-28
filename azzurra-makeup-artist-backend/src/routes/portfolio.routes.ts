// src/routes/portfolio.routes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getPortfolioItems,
  getPortfolioItemById,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolio.controller';

const router = express.Router();

// Configurazione Multer per l'upload su disco temporaneo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // La cartella 'uploads' deve esistere nella root del backend
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Rotte per il Portfolio
router.get('/', getPortfolioItems);
router.get('/:id', getPortfolioItemById);

// Per add e update, usiamo `upload.fields` per gestire più campi file
// 'mainImage' è il campo per l'immagine principale (singola)
// 'galleryImages' è il campo per le immagini della galleria (array di file, con un limite di 10)
router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  addPortfolioItem
);

router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  updatePortfolioItem
);

router.delete('/:id', deletePortfolioItem);

export default router;

