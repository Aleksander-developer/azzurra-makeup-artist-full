// src/server.ts (VERSIONE CORRETTA E COMPLETA PER ANGULAR SSR)
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'node:path';
import { LOCALE_ID } from '@angular/core';

// Nota: il polyfill $localize è ora gestito da main.server.ts per coerenza
// Se l'errore TS6053 riappare, potremmo riconsiderarlo qui.

export async function app(): Promise<express.Express> {
  const server = express();

  // Importazione del modulo AppServerModule, che Bootstrap l'applicazione Angular per SSR
  // main.server.ts si trova nella stessa cartella src/
  const { AppServerModule } = await import('./main.server');

  // 🌍 Cartelle di distribuzione (Cloud Run: /usr/src/app)
  const currentDir = process.cwd();
  // Questi percorsi devono corrispondere a dove Angular compila i tuoi bundle
  // (outputPath in angular.json)
  const browserDistFolder = join(currentDir, 'dist', 'azzurra-makeup-artist-fe', 'browser');
  const serverDistFolder = join(currentDir, 'dist', 'azzurra-makeup-artist-fe', 'server');


  if (process.env['NODE_ENV'] !== 'production') {
    console.log('📁 currentDir:', currentDir);
    console.log('📁 serverDistFolder:', serverDistFolder);
    console.log('📁 browserDistFolder:', browserDistFolder);
  }

  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');

  // 🚀 Serve asset statici globali (es. favicon, assets)
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }));

  // 🚀 Serve asset per ciascuna lingua (se hai localizzazione basata su cartelle)
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale);
    server.use(`/${locale}`, express.static(localePath, {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    }));
  });

  // 🔁 Funzione che esegue SSR per una lingua specifica
  function renderLocale(locale: string) {
    const localePath = join(browserDistFolder, locale);
    const indexHtml = join(localePath, 'index.html'); // O index.html nella root di browserDistFolder se non localizzato

    server.get(`/${locale}*`, async (req, res, next) => {
      try {
        if (process.env['NODE_ENV'] !== 'production') {
          console.log(`🔄 SSR rendering ${req.originalUrl} → ${indexHtml}`);
        }

        const html = await commonEngine.render({
          bootstrap: AppServerModule, // Il modulo server della tua app Angular
          documentFilePath: indexHtml,
          url: req.originalUrl,
          publicPath: localePath, // Il percorso pubblico per gli asset localizzati
          providers: [
            { provide: APP_BASE_HREF, useValue: `/${locale}/` },
            { provide: LOCALE_ID, useValue: locale },
          ],
        });

        res.send(html);
      } catch (err) {
        console.error(`❌ SSR error for ${req.originalUrl}:`, err);
        next(err); // Passa l'errore al gestore errori di Express
      }
    });
  }

  // 🌐 Configura SSR per tutte le lingue supportate
  supportedLocales.forEach(renderLocale);

  // 🔁 Redirect root / alla lingua predefinita
  server.get('/', (req, res) => {
    res.redirect(`/${defaultLocale}`);
  });

  // ⚠️ Catch-all 404 con fallback SSR sulla lingua predefinita
  server.get('*', async (req, res) => {
    try {
      const locale = defaultLocale;
      const localePath = join(browserDistFolder, locale);
      const indexHtml = join(localePath, 'index.html'); // O index.html nella root di browserDistFolder se non localizzato

      const html = await commonEngine.render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: req.originalUrl,
        publicPath: localePath,
        providers: [
          { provide: APP_BASE_HREF, useValue: `/${locale}/` },
          { provide: LOCALE_ID, useValue: locale },
        ],
      });

      res.status(404).send(html);
    } catch (err) {
      console.error(`❌ Errore SSR 404 fallback:`, err);
      res.status(404).send('Pagina non trovata');
    }
  });

  return server;
}

// ▶️ Avvio server
async function run(): Promise<void> {
  const port = process.env['PORT'] || 8080; // Utilizza la porta fornita da Cloud Run o 8080
  const server = await app();
  server.listen(port, () => {
    console.log(`✅ Angular SSR multilingua avviato su http://localhost:${port}`);
  });
}

run();