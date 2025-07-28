import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruccoSposaRoutingModule } from './trucco-sposa-routing.module';
import { TruccoSposaComponent } from './trucco-sposa.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    TruccoSposaComponent
  ],
  imports: [
    CommonModule,
    TruccoSposaRoutingModule,
    MaterialModule
  ]
})
export class TruccoSposaModule { }
