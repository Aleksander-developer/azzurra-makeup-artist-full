// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  {
    path: '', // Questo path è relativo a '/admin'
    canActivate: [AuthGuard], // Proteggi tutte le sottorotte di /admin
    children: [
      {
        path: '', // Rotta di default per /admin (Dashboard)
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'portfolio-manager', // Rotta per /admin/portfolio-manager
        loadChildren: () => import('../portfolio-manager/portfolio-manager.module').then(m => m.PortfolioManagerModule)
      },
      // Aggiungi qui altre rotte admin se necessario
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
