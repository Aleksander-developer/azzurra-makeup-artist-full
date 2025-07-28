// src/app/app.module.server.ts
import { NgModule, NgZone } from '@angular/core'; // Importa NgZone
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
// MODIFICATO: Importa ɵNoopNgZone (con il carattere 'ɵ')
import { ɵNoopNgZone } from '@angular/core';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    // ✅ CORREZIONE NG0908: Fornisce ɵNoopNgZone per il rendering lato server
    // Questo impedisce a NgZone di tentare operazioni basate sul browser
    // in un ambiente Node.js, risolvendo l'errore NG0908.
    { provide: NgZone, useClass: ɵNoopNgZone } // Usa ɵNoopNgZone qui
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
