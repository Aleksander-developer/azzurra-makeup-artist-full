// src/main.server.ts
// ✅ CORREZIONE $localize: Importa il polyfill $localize all'inizio
import '@angular/localize/init';

import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.module.server';