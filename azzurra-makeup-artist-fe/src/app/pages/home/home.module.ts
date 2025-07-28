// src/app/pages/home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// RIMOSSO: import { TranslateModule } from '@ngx-translate/core'; // <-- Rimosso
import { SharedModule } from "../../shared/shared/shared.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    // RIMOSSO: TranslateModule, // <-- Rimosso
    SharedModule
  ]
})
export class HomeModule { }
