// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../../shared/material/material.module';

@NgModule({
  declarations: [
    // Nessun componente dichiarato qui, sono tutti lazy-loaded o in moduli specifici
  ],
  imports: [
    CommonModule,
    AdminRoutingModule, // Importa il modulo di routing dell'area admin
    MaterialModule // Per i componenti Material usati nell'area admin (es. MatCard, MatButton)
  ]
})
export class AdminModule { }

