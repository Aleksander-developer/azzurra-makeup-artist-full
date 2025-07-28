    // src/app/shared/material/material.module.ts
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';

    // Moduli di Angular Material
    import { MatToolbarModule } from '@angular/material/toolbar';
    import { MatButtonModule } from '@angular/material/button';
    import { MatMenuModule } from '@angular/material/menu'; // <-- Importante per mat-menu e matMenuTriggerFor
    import { MatCardModule } from '@angular/material/card';
    import { MatGridListModule } from '@angular/material/grid-list';
    import { MatIconModule } from '@angular/material/icon';
    import { MatChipsModule } from '@angular/material/chips';
    import { MatInputModule } from '@angular/material/input';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatSnackBarModule } from '@angular/material/snack-bar';
    import { MatDividerModule } from '@angular/material/divider';
    import { MatSidenavModule } from '@angular/material/sidenav';
    import { MatListModule } from '@angular/material/list';
    import { MatProgressBarModule } from '@angular/material/progress-bar';
    import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatSelectModule } from '@angular/material/select'; // <-- AGGIUNGI QUESTO (per il campo categoria nel portfolio manager)
import { MatTableModule } from '@angular/material/table'; // <-- AGGIUNGI QUESTO (per la tabella nel portfolio manager)

    // Altri moduli (se usati in MaterialModule, altrimenti potresti volerli spostare)
    import { RouterModule } from '@angular/router'; // Necessario per routerLink
    import { LayoutModule } from '@angular/cdk/layout';
    import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


    @NgModule({
      imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule, // <-- Assicurati che sia qui
        MatIconModule,
        MatCardModule,
        MatGridListModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDividerModule,
        MatSidenavModule,
        MatListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        RouterModule, // <-- Necessario per routerLink
        LayoutModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatTableModule
      ],
      exports: [
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule, // <-- Assicurati che sia qui
        MatIconModule,
        MatCardModule,
        MatGridListModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDividerModule,
        MatSidenavModule,
        MatListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        RouterModule, // <-- Necessario per routerLink
        LayoutModule,
        ReactiveFormsModule,
        MatDialogModule, // <-- AGGIUNGI QUESTO
        MatSelectModule, // <-- AGGIUNGI QUESTO
        MatTableModule,
      ]
    })
    export class MaterialModule { }
    
  