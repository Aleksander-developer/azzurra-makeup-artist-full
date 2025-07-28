// src/app/shared/components/navbar/navbar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service'; // Reimporta AuthService
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// RIMOSSO: import { TranslateService } from '@ngx-translate/core'; // Non usiamo @ngx-translate

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false; // Proprietà per tenere traccia dello stato di login
  private destroy$ = new Subject<void>(); // Per gestire la disiscrizione

  constructor(
    private authService: AuthService, // Reinietta AuthService
    // RIMOSSO: private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // Sottoscriviti allo stato di login dell'AuthService
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$)) // Gestisce la disiscrizione quando il componente viene distrutto
      .subscribe((status: boolean) => {
        this.isLoggedIn = status;
        console.log('Stato di login aggiornato nella navbar:', this.isLoggedIn);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(lang: string): void {
    console.log(`Lingua cambiata a: ${lang}`);
    // Qui in futuro implementeremo la logica di i18n nativa di Angular
    // Se stai usando @angular/localize, la gestione della lingua è più complessa
    // e di solito avviene tramite il routing o la configurazione del server.
    // Per ora, questo console.log è sufficiente.
  }
}

