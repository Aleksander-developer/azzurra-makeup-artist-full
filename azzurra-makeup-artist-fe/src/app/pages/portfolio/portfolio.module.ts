import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';
import { MaterialModule } from '../../shared/material/material.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    RouterModule,
    MaterialModule
  ]
})
export class PortfolioModule { }
