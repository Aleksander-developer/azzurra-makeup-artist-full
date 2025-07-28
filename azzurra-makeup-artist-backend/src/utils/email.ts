// src/utils/email.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendConfirmationEmail = async (to: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Conferma Iscrizione Newsletter',
    text: 'Grazie per esserti iscritto alla nostra newsletter!',
  };

  await transporter.sendMail(mailOptions);
};

