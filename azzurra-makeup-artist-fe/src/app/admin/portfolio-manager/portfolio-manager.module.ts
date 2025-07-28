// src/app/admin/portfolio-manager/portfolio-manager.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Necessario per i form reattivi
import { RouterModule } from '@angular/router'; // Necessario per routerLink
import { AdminPortfolioManagerComponent } from './portfolio-manager.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ConfirmationDialogModule } from '../../shared/components/confirmation-dialog/confirmation-dialog.module';
import { PortfolioManagerRoutingModule } from './portfolio-manager-routing.module';



@NgModule({
  declarations: [
    AdminPortfolioManagerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule, // Contiene tutti i moduli Material necessari (MatCard, MatFormField, MatInput, MatSelect, MatButton, MatIcon, MatProgressSpinner, MatTable, MatSnackBar, MatDialog)
    ConfirmationDialogModule, // Importa il modulo del dialogo di conferma
    PortfolioManagerRoutingModule // Il modulo di routing specifico per il portfolio manager
  ]
})
export class PortfolioManagerModule { }
