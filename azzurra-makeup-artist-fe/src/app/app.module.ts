    import { NgModule } from '@angular/core';
    import { BrowserModule, Meta, provideClientHydration, Title } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

    // Importa i moduli delle tue pagine
    import { HomeModule } from './pages/home/home.module';
    // Importa il tuo SharedModule e MaterialModule
    import { SharedModule } from './shared/shared/shared.module';
    import { MaterialModule } from './shared/material/material.module';
import { AuthService } from './auth/auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // Moduli delle pagine (importa solo quelli che sono eager-loaded o che contengono componenti usati nel root)
        // HomeModule è lazy-loaded, quindi non dovrebbe essere qui a meno che tu non lo voglia eager.
        // Per ora, lo lasciamo fuori se è lazy-loaded.
        // Se `app-reviews` è usato in `app.component.html` o in un componente eager, SharedModule deve essere importato qui.
        SharedModule, // SharedModule contiene ReviewsComponent, NavbarComponent, FooterComponent
        MaterialModule // MaterialModule contiene tutti i moduli di Angular Material
      ],
      providers: [
        AuthService,
        provideHttpClient(withFetch()),
        provideClientHydration(),
        provideAnimationsAsync(),
        Title,
        Meta
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }

