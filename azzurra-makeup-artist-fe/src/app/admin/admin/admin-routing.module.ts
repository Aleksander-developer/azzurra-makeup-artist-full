// src/app/admin/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard'; // Assicurati che il percorso sia corretto

const routes: Routes = [
  {
    path: '', // Questo path è relativo a '/admin'
    canActivate: [AuthGuard], // Proteggi tutte le sottorotte di /admin
    children: [
      {
        path: '', // Rotta di default per /admin (ora Portfolio Manager)
        loadChildren: () => import('../portfolio-manager/portfolio-manager.module').then(m => m.PortfolioManagerModule)
      },
      // Rimosso: { path: '', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) }
      // La rotta 'portfolio-manager' esplicita non è più strettamente necessaria se è la default,
      // ma puoi mantenerla se prevedi altre rotte admin in futuro che non siano la default.
      // Per chiarezza, la lascio commentata qui ma non la includo nel codice finale se non serve.
      // {
      //   path: 'portfolio-manager', // Rotta per /admin/portfolio-manager (se vuoi una rotta esplicita oltre la default)
      //   loadChildren: () => import('../portfolio-manager/portfolio-manager.module').then(m => m.PortfolioManagerModule)
      // },
      // Aggiungi qui altre rotte admin se necessario
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
