// src/main.server.ts

// ✅ CORREZIONE $localize: Importa il polyfill $localize all'inizio
// Questo assicura che la funzione $localize sia disponibile nell'ambiente Node.js
// prima che l'applicazione Angular tenti di utilizzarla per il rendering SSR.


import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.module.server'; // Assicurati che questo percorso sia corretto

