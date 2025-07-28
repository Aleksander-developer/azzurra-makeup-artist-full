import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { LOCALE_ID } from '@angular/core';

export async function app(): Promise<express.Express> {
  const server = express();
  const AppServerModule = (await import('./src/main.server')).default;

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, 'dist', 'azzurra-makeup-artist-fe', 'browser');

  const supportedLocales = ['it'];
  const defaultLocale = 'it';

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');

  // Serve statici generici
  server.use(express.static(browserDistFolder, { maxAge: '1y' }));

  // Serve statici per le lingue
  supportedLocales.forEach((locale) => {
    const localePath = resolve(browserDistFolder, locale);
    server.use(`/${locale}`, express.static(localePath, { maxAge: '1y' }));
  });

  // SSR per ciascuna lingua
  supportedLocales.forEach((locale) => {
    const localePath = resolve(browserDistFolder, locale);
    const indexHtml = resolve(localePath, 'index.html');

    server.get(`/${locale}*`, async (req, res, next) => {
      try {
        const html = await commonEngine.render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: req.originalUrl,
          providers: [
            { provide: APP_BASE_HREF, useValue: `/${locale}/` },
            { provide: LOCALE_ID, useValue: locale },
          ],
        });
        res.send(html);
      } catch (err) {
        console.error(`❌ SSR error for ${req.originalUrl}:`, err);
        next(err);
      }
    });
  });

  // Redirect root → default locale
  server.get('/', (req, res) => {
    res.redirect(`/${defaultLocale}`);
  });

  return server;
}

async function run(): Promise<void> {
  const port = process.env['PORT'] || 4000;
  const server = await app();
  server.listen(port, () => {
    console.log(`✅ Angular SSR multilingua avviato su http://localhost:${port}`);
  });
}

run();

