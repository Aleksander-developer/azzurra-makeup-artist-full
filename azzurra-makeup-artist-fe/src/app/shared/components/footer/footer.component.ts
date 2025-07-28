    // src/app/shared/components/footer/footer.component.ts

    import { Component, OnInit } from '@angular/core';
    import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
    // RIMOSSO: import { TranslateService } from '@ngx-translate/core';

    @Component({
      selector: 'app-footer',
      templateUrl: './footer.component.html',
      styleUrls: ['./footer.component.scss']
    })
    export class FooterComponent implements OnInit {
      public currentYear: number = new Date().getFullYear();

      // Le tue URL e numeri di contatto
      // githubUrl: string = 'https://github.com/tuo-profilo-github'; // AGGIORNA CON IL TUO LINK
      linkedinUrl: string = 'http://linkedin.com/in/maria-azzurra-angius-2581301b3';
      instagramUrl: string = 'https://www.instagram.com/azzurra_angius?igsh=MWNyODRqNmZqZXdqbg==';
      facebookUrl: string = 'https://www.facebook.com/share/1E2KCeD1dz/?mibextid=wwXIfr';

      whatsappNumber: string = '393469604243'; // Il tuo numero WhatsApp senza il '+'
      phoneNumber: string = '393469604243'; // Il tuo numero di telefono
      emailAddress: string = 'azzurraangius95@gmail.com'; // La tua email

      // URL del sito web dello sviluppatore
      developerWebsiteUrl: string = 'https://aleksander-nikolli-developer.netlify.app/home';

      whatsappLink: SafeResourceUrl;

      constructor(private sanitizer: DomSanitizer) {
        this.whatsappLink = this.sanitizer.bypassSecurityTrustResourceUrl(`https://wa.me/${this.whatsappNumber}`);
      }

      ngOnInit(): void {
        // Nessuna logica specifica qui per ora
      }
    }
    
  