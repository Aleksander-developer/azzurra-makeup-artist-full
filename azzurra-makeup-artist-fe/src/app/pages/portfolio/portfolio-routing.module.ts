import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent },
  {
    path: ':id',
    loadChildren: () =>
      import('./portfolio-detail/portfolio-detail.module').then(m => m.PortfolioDetailModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }

