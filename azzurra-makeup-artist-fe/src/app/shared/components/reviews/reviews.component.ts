// src/app/shared/components/reviews/reviews.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

// Importa $localize
declare const $localize: any;

interface Review {
  author: string;
  text: string;
  rating: number; // 1-5 stars
}

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  reviews: Review[] = [
    {
      author: $localize`:@@reviewAuthor1:Giulia Rossi`,
      text: $localize`:@@reviewText1:Azzurra ha trasformato il mio look per il matrimonio! Trucco impeccabile e acconciatura perfetta, mi sono sentita una vera principessa. Professionale e attenta ad ogni dettaglio.`,
      rating: 5
    },
    {
      author: $localize`:@@reviewAuthor2:Martina Bianchi`,
      text: $localize`:@@reviewText2:Servizio fantastico per il mio evento speciale. Azzurra è riuscita a capire esattamente cosa volevo e ha superato ogni aspettativa. Consigliatissima!`,
      rating: 5
    },
    {
      author: $localize`:@@reviewAuthor3:Chiara Verdi`,
      text: $localize`:@@reviewText3:Un'esperienza meravigliosa! Azzurra non è solo un'artista del make-up, ma anche una persona dolcissima che ti mette subito a tuo agio. Il risultato è stato sublime.`,
      rating: 5
    },
    {
      author: $localize`:@@reviewAuthor4:Elena Neri`,
      text: $localize`:@@reviewText4:Ho apprezzato molto la sua professionalità e la qualità dei prodotti usati. Il trucco è durato tutta la giornata e ho ricevuto tantissimi complimenti.`,
      rating: 4
    },
    {
      author: $localize`:@@reviewAuthor5:Francesca Gialli`,
      text: $localize`:@@reviewText5:Azzurra è incredibile! Ha realizzato un trucco che ha valorizzato i miei lineamenti in modo naturale e sofisticato. Non potrei essere più felice.`,
      rating: 5
    }
  ];

  currentReviewIndex: number = 0;
  private carouselInterval: Subscription | undefined;
  private isComponentAlive: boolean = true; // Flag per gestire la sottoscrizione

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { } // Inietta PLATFORM_ID

  ngOnInit(): void {
    if (this.reviews.length > 1) {
      // Avvia il carousel solo se siamo nel browser
      if (isPlatformBrowser(this.platformId)) {
        this.startCarousel();
      }
    }
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false; // Imposta il flag a false
    if (this.carouselInterval) {
      this.carouselInterval.unsubscribe();
    }
  }

  startCarousel(): void {
    // Intervallo di 7 secondi per cambiare recensione
    this.carouselInterval = interval(7000)
      .pipe(takeWhile(() => this.isComponentAlive)) // Continua solo se il componente è attivo
      .subscribe(() => {
        this.nextReview();
      });
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      this.carouselInterval.unsubscribe();
    }
  }

  nextReview(): void {
    this.stopCarousel(); // Ferma il carousel automatico quando l'utente interagisce
    this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
    this.startCarousel(); // Riavvia il carousel dopo l'interazione
  }

  prevReview(): void {
    this.stopCarousel(); // Ferma il carousel automatico quando l'utente interagisce
    this.currentReviewIndex = (this.currentReviewIndex - 1 + this.reviews.length) % this.reviews.length;
    this.startCarousel(); // Riavvia il carousel dopo l'interazione
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}

