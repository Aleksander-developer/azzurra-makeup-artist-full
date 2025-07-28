import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiSonoRoutingModule } from './chi-sono-routing.module';
import { ChiSonoComponent } from './chi-sono.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    ChiSonoComponent
  ],
  imports: [
    CommonModule,
    ChiSonoRoutingModule,
    MaterialModule
  ]
})
export class ChiSonoModule { }
