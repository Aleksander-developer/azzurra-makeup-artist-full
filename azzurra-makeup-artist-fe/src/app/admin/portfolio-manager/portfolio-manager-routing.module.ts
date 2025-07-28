// src/app/admin/portfolio-manager/portfolio-manager-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPortfolioManagerComponent } from './portfolio-manager.component';

const routes: Routes = [
  { path: '', component: AdminPortfolioManagerComponent } // La rotta sarà /admin/portfolio-manager
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioManagerRoutingModule { }
