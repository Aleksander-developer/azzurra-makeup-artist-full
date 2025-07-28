import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiSonoComponent } from './chi-sono.component';

const routes: Routes = [
  { path: '', component: ChiSonoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChiSonoRoutingModule { }
