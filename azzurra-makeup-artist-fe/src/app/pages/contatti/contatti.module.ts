import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContattiRoutingModule } from './contatti-routing.module';
import { ContattiComponent } from './contatti.component';
import { MaterialModule } from '../../shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContattiComponent
  ],
  imports: [
    CommonModule,
    ContattiRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class ContattiModule { }
