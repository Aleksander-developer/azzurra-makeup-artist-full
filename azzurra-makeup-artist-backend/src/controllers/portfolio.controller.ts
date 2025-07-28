// src/controllers/portfolio.controller.ts
import { Request, Response } from 'express';
import { PortfolioItem, IPortfolioImage } from '../models/progetto.model'; // Importa il modello aggiornato
import cloudinary from '../config/cloudinary.config'; // Importa Cloudinary
import fs from 'fs'; // Per eliminare i file temporanei di Multer
import path from 'path'; // Per risolvere i percorsi dei file

// Funzione helper per eliminare i file temporanei di Multer
const cleanupMulterFiles = (files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]) => {
  if (files) {
    if (Array.isArray(files)) {
      files.forEach(file => {
        if (file && file.path) {
          fs.unlink(file.path, (err) => {
            if (err) console.error(`Errore nell'eliminazione del file temporaneo ${file.path}:`, err);
          });
        }
      });
    } else {
      for (const key in files) {
        if (Object.prototype.hasOwnProperty.call(files, key)) {
          files[key].forEach(file => {
            if (file && file.path) {
              fs.unlink(file.path, (err) => {
                if (err) console.error(`Errore nell'eliminazione del file temporaneo ${file.path}:`, err);
              });
            }
          });
        }
      }
    }
  }
};


// GET tutti gli elementi del portfolio
export const getPortfolioItems = async (_req: Request, res: Response) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 }); // Ordina dal più recente
    res.json(items);
  } catch (error) {
    console.error('Errore nel recupero degli elementi del portfolio:', error);
    res.status(500).json({ message: 'Errore nel recupero degli elementi del portfolio', error });
  }
};

// GET un singolo elemento del portfolio per ID
export const getPortfolioItemById = async (req: Request, res: Response) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Elemento del portfolio non trovato' });
    }
    res.json(item);
  } catch (error) {
    console.error('Errore nel recupero dell\'elemento del portfolio:', error);
    res.status(500).json({ message: 'Errore nel recupero dell\'elemento del portfolio', error });
  }
};

// POST Aggiungi un nuovo elemento del portfolio (con upload immagini)
export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, category } = req.body;
    // Multer mette i file in req.files (se fields) o req.file (se single)
    const mainImageFile = (req.files as { [fieldname: string]: Express.Multer.File[] })?.mainImage?.[0];
    const galleryFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })?.galleryImages;

    // I dati testuali delle immagini della galleria vengono inviati come array di stringhe JSON
    // Dobbiamo parsare ogni elemento dell'array
    const imagesData: IPortfolioImage[] = req.body.images ? JSON.parse(req.body.images).map((imgStr: string) => JSON.parse(imgStr)) : [];


    if (!title || !category) {
      cleanupMulterFiles(req.files as { [fieldname: string]: Express.Multer.File[] }); // Pulisci i file in caso di errore
      return res.status(400).json({ message: 'Titolo e Categoria sono obbligatori.' });
    }
    if (!mainImageFile) {
      cleanupMulterFiles(req.files as { [fieldname: string]: Express.Multer.File[] }); // Pulisci i file in caso di errore
      return res.status(400).json({ message: 'Immagine principale è obbligatoria.' });
    }

    let mainImageUrl = '';

    // Upload immagine principale
    const resultMain = await cloudinary.uploader.upload(mainImageFile.path, {
      folder: 'azzurra-makeup/portfolio-main',
      quality: "auto:low",
      fetch_format: "auto"
    });
    mainImageUrl = resultMain.secure_url;
    fs.unlinkSync(mainImageFile.path); // Elimina il file temporaneo

    // Upload immagini della galleria
    const galleryImages: IPortfolioImage[] = [];
    if (galleryFiles && galleryFiles.length > 0) {
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'azzurra-makeup/portfolio-gallery',
          quality: "auto:low",
          fetch_format: "auto"
        });
        fs.unlinkSync(file.path); // Elimina il file temporaneo

        // Trova i dettagli corrispondenti dal frontend
        const imageDetails: IPortfolioImage = imagesData[i] || { src: '', description: '', alt: '' };
        galleryImages.push({
          src: result.secure_url,
          description: imageDetails.description || '',
          alt: imageDetails.alt || ''
        });
      }
    }

    const newItem = new PortfolioItem({
      title,
      subtitle,
      description,
      mainImage: mainImageUrl,
      category,
      images: galleryImages,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Errore nell\'aggiunta dell\'elemento del portfolio:', error);
    cleanupMulterFiles(req.files as { [fieldname: string]: Express.Multer.File[] }); // Pulisci i file in caso di errore
    res.status(500).json({ message: 'Errore nell\'aggiunta dell\'elemento del portfolio', error });
  }
};

// PUT Aggiorna un elemento del portfolio (con upload immagini)
export const updatePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, category } = req.body;
    const mainImageFile = (req.files as { [fieldname: string]: Express.Multer.File[] })?.mainImage?.[0];
    const galleryFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })?.galleryImages;

    // I dati testuali delle immagini della galleria (esistenti + nuove descrizioni)
    const imagesData: IPortfolioImage[] = req.body.images ? JSON.parse(req.body.images).map((imgStr: string) => JSON.parse(imgStr)) : [];

    const item = await PortfolioItem.findById(id);
    if (!item) {
      cleanupMulterFiles(req.files as { [fieldname: string]: Express.Multer.File[] });
      return res.status(404).json({ message: 'Elemento del portfolio non trovato' });
    }

    // Aggiorna i campi testuali
    item.title = title || item.title;
    item.subtitle = subtitle !== undefined ? subtitle : item.subtitle;
    item.description = description !== undefined ? description : item.description;
    item.category = category || item.category;

    // Gestione immagine principale
    if (mainImageFile) {
      // Opzionale: Elimina la vecchia immagine principale da Cloudinary se vuoi
      // if (item.mainImage && item.mainImage.includes('cloudinary')) {
      //   const publicId = item.mainImage.split('/').pop()?.split('.')[0];
      //   if (publicId) await cloudinary.uploader.destroy(`azzurra-makeup/portfolio-main/${publicId}`);
      // }
      const result = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: 'azzurra-makeup/portfolio-main',
        quality: "auto:low",
        fetch_format: "auto"
      });
      item.mainImage = result.secure_url;
      fs.unlinkSync(mainImageFile.path); // Elimina il file temporaneo
    } else if (req.body.mainImage === '') { // Se il frontend ha inviato una stringa vuota, significa che l'immagine è stata rimossa
        item.mainImage = '';
        // Opzionale: Elimina la vecchia immagine principale da Cloudinary se vuoi
        // if (item.mainImage && item.mainImage.includes('cloudinary')) {
        //   const publicId = item.mainImage.split('/').pop()?.split('.')[0];
        //   if (publicId) await cloudinary.uploader.destroy(`azzurra-makeup/portfolio-main/${publicId}`);
        // }
    }


    // Gestione immagini della galleria
    const finalGalleryImages: IPortfolioImage[] = [];
    let galleryFileIndex = 0;

    for (const imgData of imagesData) { // Itera direttamente su imagesData
        if (imgData.isNew && galleryFiles && galleryFileIndex < galleryFiles.length) {
            const file = galleryFiles[galleryFileIndex];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'azzurra-makeup/portfolio-gallery',
                quality: "auto:low",
                fetch_format: "auto"
            });
            fs.unlinkSync(file.path); // Elimina il file temporaneo
            finalGalleryImages.push({
                src: result.secure_url,
                description: imgData.description || '',
                alt: imgData.alt || ''
            });
            galleryFileIndex++;
        } else if (imgData.src) { // Se è un'immagine esistente o un URL non caricato
            finalGalleryImages.push({
                src: imgData.src,
                description: imgData.description || '',
                alt: imgData.alt || ''
            });
        }
    }

    item.images = finalGalleryImages;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'elemento del portfolio:', error);
    cleanupMulterFiles(req.files as { [fieldname: string]: Express.Multer.File[] }); // Pulisci i file in caso di errore
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'elemento del portfolio', error });
  }
};


// DELETE Elimina un elemento del portfolio
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await PortfolioItem.findByIdAndDelete(id); // Elimina l'elemento dal DB

    if (!item) {
      return res.status(404).json({ message: 'Elemento del portfolio non trovato' });
    }

    // Opzionale: Elimina le immagini associate da Cloudinary
    // if (item.mainImage && item.mainImage.includes('cloudinary')) {
    //   const publicId = item.mainImage.split('/').pop()?.split('.')[0];
    //   if (publicId) await cloudinary.uploader.destroy(`azzurra-makeup/portfolio-main/${publicId}`);
    // }
    // if (item.images && item.images.length > 0) {
    //   for (const img of item.images) {
    //     if (img.src.includes('cloudinary')) {
    //       const publicId = img.src.split('/').pop()?.split('.')[0];
    //       if (publicId) await cloudinary.uploader.destroy(`azzurra-makeup/portfolio-gallery/${publicId}`);
    //     }
    //   }
    // }

    res.status(200).json({ message: 'Elemento del portfolio eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'elemento del portfolio:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'elemento del portfolio', error });
  }
};

