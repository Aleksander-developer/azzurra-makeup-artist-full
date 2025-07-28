// src/app/shared/components/confirmation-dialog/confirmation-dialog.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog'; // Necessario per MatDialog
import { MatButtonModule } from '@angular/material/button'; // Necessario per MatButton
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    ConfirmationDialogComponent // Esporta il componente per renderlo disponibile
  ]
})
export class ConfirmationDialogModule { }

