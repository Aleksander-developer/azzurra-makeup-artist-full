// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'chi-sono',
    loadChildren: () => import('./pages/chi-sono/chi-sono.module').then(m => m.ChiSonoModule)
  },
  {
    path: 'contatti',
    loadChildren: () => import('./pages/contatti/contatti.module').then(m => m.ContattiModule)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then(m => m.PortfolioModule)
  },
  {
    path: 'trucco-sposa',
    loadChildren: () => import('./pages/trucco-sposa/trucco-sposa.module').then(m => m.TruccoSposaModule)
  },
  {
    path: 'servizi',
    loadChildren: () => import('./pages/servizi/servizi.module').then(m => m.ServiziModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'admin', // Rotta per l'area amministrativa
    loadChildren: () => import('./admin/admin/admin.module').then(m => m.AdminModule), // <-- Lazy load del modulo Admin
    canActivate: [AuthGuard] // Applica la guardia all'intero modulo admin
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

