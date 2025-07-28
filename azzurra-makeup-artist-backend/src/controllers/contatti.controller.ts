// api/src/controllers/contatti.controller.ts
import { Request, Response } from 'express';
import { Contatto } from '../models/contatto.model'; // Percorso corretto
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const inviaMessaggio = async (req: Request, res: Response) => {
  const { nome, email, messaggio, cellulare } = req.body;
  console.log('Ricevuto:', req.body);

  if (!nome || !email || !messaggio) {
    return res.status(400).json({ message: 'Tutti i campi obbligatori' });
  }

  try {
    // 1. Salva nel DB
    const nuovoMessaggio = new Contatto({ nome, email, messaggio, cellulare });
    await nuovoMessaggio.save();

    // 2. Crea il transporter nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // <-- gestisce certificati self-signed
      }
    });

    // 3. Email al proprietario del sito
    const mailToAdmin = {
      from: `"Modulo Contatti" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINATION,
      subject: ' Nuovo messaggio dal modulo contatti',
      html: `
        <h2>Hai ricevuto un nuovo messaggio</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Cellulare:</strong> ${cellulare || 'Non fornito'}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${messaggio}</p>
      `
    };

    // 4. Email di conferma all'utente
    const mailToUser = {
      from: `"${process.env.SITE_NAME || 'Il tuo sito'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: ' Conferma ricezione messaggio',
      html: `
        <p>Ciao ${nome},</p>
        <p>Grazie per averci contattato. Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.</p>
        <hr>
        <p><strong>Messaggio:</strong></p>
        <blockquote>${messaggio}</blockquote>
        <br>
        <p>— ${process.env.SITE_NAME || 'Il team'}.</p>
      `
    };

    // 5. Invia entrambe le email
    await transporter.sendMail(mailToAdmin);
    await transporter.sendMail(mailToUser);

    return res.status(201).json({ message: 'Messaggio inviato con successo' });

  } catch (error) {
    console.error('Errore invio:', error);
    return res.status(500).json({ message: 'Errore del server', error });
  }
};

