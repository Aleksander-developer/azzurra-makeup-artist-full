// server.ts
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'node:path';
import { LOCALE_ID } from '@angular/core';

export async function app(): Promise<express.Express> {
  const server = express();

  const { AppServerModule } = await import('./src/main.server');

  // ***** MODIFICHE QUI: Percorsi per Cloud Run *****
  // Cloud Run esegue il server da /usr/src/app (come definito nel Dockerfile)
  // I file del browser sono in /usr/src/app/browser
  // I file del server sono in /usr/src/app/server
  const currentDir = process.cwd(); // Ottiene la directory di lavoro corrente del processo Node.js
  const browserDistFolder = join(currentDir, 'browser'); // Il tuo Dockerfile copia in /usr/src/app/browser
  const serverDistFolder = join(currentDir, 'server');   // Il tuo Dockerfile copia in /usr/src/app/server

  console.log('📁 currentDir:', currentDir);
  console.log('📁 serverDistFolder:', serverDistFolder);
  console.log('📁 browserDistFolder:', browserDistFolder);
  // *************************************************

  const supportedLocales = ['it', 'en'];
  const defaultLocale = 'it';

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');

  // Serve gli asset globali dalla root della cartella browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
  }));

  // Serve gli asset specifici della lingua
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale); // Usiamo join qui
    server.use(`/${locale}`, express.static(localePath, {
      maxAge: '1y',
    }));
  });

  // SSR per ogni lingua
  supportedLocales.forEach((locale) => {
    const localePath = join(browserDistFolder, locale); // Usiamo join qui
    const indexHtml = join(localePath, 'index.html'); // Usiamo join qui

    server.get(`/${locale}*`, async (req, res, next) => {
      try {
        console.log(`🔄 SSR rendering ${req.originalUrl} → ${indexHtml}`);
        const html = await commonEngine.render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: req.originalUrl,
          publicPath: localePath,
          providers: [
            { provide: APP_BASE_HREF, useValue: `/${locale}/` },
            { provide: LOCALE_ID, useValue: locale }
          ],
        });
        res.send(html);
      } catch (err) {
        console.error(`❌ SSR error for ${req.originalUrl}:`, err);
        next(err);
      }
    });
  });

  // Redirect dalla root alla lingua predefinita
  server.get('/', (req, res) => {
    res.redirect(`/${defaultLocale}`);
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
