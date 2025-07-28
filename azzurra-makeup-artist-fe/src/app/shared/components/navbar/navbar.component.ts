    // src/app/shared/components/navbar/navbar.component.ts
    import { Component } from '@angular/core';
    // RIMOSSO: import { AuthService } from '../../../auth/auth.service';
    // RIMOSSO: import { TranslateService } from '@ngx-translate/core';

    @Component({
      selector: 'app-navbar',
      templateUrl: './navbar.component.html',
      styleUrls: ['./navbar.component.scss']
    })
    export class NavbarComponent {
      // isLoggedIn = false; // RIMOSSO: non abbiamo AuthService per ora

      constructor(
        // RIMOSSO: private auth: AuthService,
        // RIMOSSO: private translate: TranslateService
      ) {
        // RIMOSSO: Logica di autenticazione e traduzione
        // this.auth.isLoggedIn$.subscribe((status: boolean) => {
        //   this.isLoggedIn = status;
        // });
      }

      // RIMOSSO: logout(): void { this.auth.logout(); }

      // Metodo per cambiare la lingua (per ora solo console log)
      changeLanguage(lang: string): void {
        console.log(`Lingua cambiata a: ${lang}`);
        // Qui in futuro implementeremo la logica di i18n nativa di Angular
      }
    }
    
