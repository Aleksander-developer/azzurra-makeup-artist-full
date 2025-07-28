import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioDetailComponent } from './portfolio-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioDetailRoutingModule { }

