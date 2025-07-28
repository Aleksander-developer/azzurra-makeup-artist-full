import '@angular/localize/init';

import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import { AppServerModule } from './app/app.module.server';
export default AppServerModule;

