import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioDetailRoutingModule } from './portfolio-detail-routing.module';
import { PortfolioDetailComponent } from './portfolio-detail.component';
import { MaterialModule } from '../../../shared/material/material.module';


@NgModule({
  declarations: [
    PortfolioDetailComponent
  ],
  imports: [
    CommonModule,
    PortfolioDetailRoutingModule,
    MaterialModule
  ]
})
export class PortfolioDetailModule { }
