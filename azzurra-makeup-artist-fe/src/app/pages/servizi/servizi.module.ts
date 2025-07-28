import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiziRoutingModule } from './servizi-routing.module';
import { ServiziComponent } from './servizi.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    ServiziComponent
  ],
  imports: [
    CommonModule,
    ServiziRoutingModule,
    MaterialModule
  ]
})
export class ServiziModule { }
