// src/server.ts (VERSIONE ADATTATA E CONFERMATA PER ANGULAR SSR)
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'node:path';
import { LOCALE_ID } from '@angular/core';

export async function app(): Promise<express.Express> {
  const server = express();

  // Importazione del modulo AppServerModule
  // main.server.ts si trova nella stessa cartella 'src/' rispetto a questo server.ts
  const { AppServerModule } = await import('./src/main.server'); // Percorso relativo a server.ts (se server.ts è in src/)

  // ***** MODIFICHE AI PERCORSI PER CLOUD RUN *****
  // Cloud Run esegue il server dalla directory di lavoro del container (es. /usr/src/app).
  // Nel tuo Dockerfile, copi le cartelle 'server' e 'browser' DENTRO /usr/src/app.
  // Quindi, i percorsi all'interno del container saranno /usr/src/app/browser e /usr/src/app/server.

  const currentDir = process.cwd(); // Questa sarà la directory di lavoro corrente del processo Node.js (es. /usr/src/app)

  // Percorsi corretti all'interno del container DOPO IL COPY del Dockerfile
  const browserDistFolder = join(currentDir, 'browser'); // Puntiamo direttamente alla cartella 'browser' in /usr/src/app
  const serverDistFolder = join(currentDir, 'server');   // Puntiamo direttamente alla cartella 'server' in /usr/src/app

  console.log('📁 currentDir:', currentDir);
  console.log('📁 serverDistFolder:', serverDistFolder);
  console.log('📁 browserDistFolder:', browserDistFolder);
  // *************************************************

  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');

  // Serve gli asset globali dalla root della cartella browser (es. stili, script JS, immagini non localizzate)
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
  }));

  // Serve gli asset specifici della lingua (se hai localizzazione basata su cartelle)
  // Questo si occupa di percorsi come /it/index.html, /en/index.html
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale);
    server.use(`/${locale}`, express.static(localePath, {
      maxAge: '1y',
    }));
  });

  // SSR per ogni lingua
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale);
    const indexHtml = join(localePath, 'index.html'); // index.html all'interno della cartella della lingua (es. browser/it/index.html)

    server.get(`/${locale}*`, async (req, res, next) => {
      try {
        console.log(`🔄 SSR rendering ${req.originalUrl} → ${indexHtml}`);
        const html = await commonEngine.render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: req.originalUrl,
          publicPath: localePath, // Il percorso pubblico per gli asset localizzati
          providers: [
            { provide: APP_BASE_HREF, useValue: `/${locale}/` },
            { provide: LOCALE_ID, useValue: locale }
          ],
        });
        res.send(html);
      } catch (err) {
        console.error(`❌ SSR error for ${req.originalUrl}:`, err);
        next(err); // Passa l'errore al gestore errori di Express
      }
    });
  });

  // 🎯 Servizio diretto del favicon
  server.get('/favicon.ico', (req, res) => {
    res.sendFile(join(browserDistFolder, 'favicon.ico'));
  });

  // 🔁 Redirect dalla root alla lingua predefinita
  server.get('/', (req, res) => {
    res.redirect(`/${defaultLocale}`);
  });

  // ⚠️ Catch-all 404 con fallback SSR sulla lingua predefinita
  server.get('*', async (req, res) => {
    try {
      const locale = defaultLocale;
      const localePath = join(browserDistFolder, locale);
      const indexHtml = join(localePath, 'index.html');

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

async function run(): Promise<void> {
  const port = process.env['PORT'] || 8080;
  const server = await app();
  server.listen(port, () => {
    console.log(`✅ Angular SSR multilingua avviato su http://localhost:${port}`);
  });
}

run();