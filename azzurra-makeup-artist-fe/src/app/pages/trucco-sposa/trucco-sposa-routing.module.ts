import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruccoSposaComponent } from './trucco-sposa.component';

const routes: Routes = [{ path: '', component: TruccoSposaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TruccoSposaRoutingModule { }
