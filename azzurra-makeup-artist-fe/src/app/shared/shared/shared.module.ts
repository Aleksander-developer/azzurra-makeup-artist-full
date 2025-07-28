// src/app/shared/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ReviewsComponent } from '../components/reviews/reviews.component';
import { QuoteBoxComponent } from '../components/quote-box/quote-box.component';
import { WhyChoseMeComponent } from '../components/why-chose-me/why-chose-me.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    ReviewsComponent,
    QuoteBoxComponent,
    WhyChoseMeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
    exports: [
      FooterComponent,
      NavbarComponent,
      ReviewsComponent,
      QuoteBoxComponent,
      WhyChoseMeComponent,
      MaterialModule // <-- AGGIUNTO QUI: Esporta anche MaterialModule per chi importa SharedModule
    ]
})
export class SharedModule { }

