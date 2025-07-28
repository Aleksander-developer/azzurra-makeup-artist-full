// src/app/pages/home/home.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  group // Importa group per animazioni parallele
} from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

// Importa $localize
declare const $localize: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('imageFade', [
      transition(':increment, :decrement', [ // Animazione per cambio immagine (avanti/indietro)
        group([ // Esegue animazioni in parallelo
          query(':enter', [ // Nuova immagine che entra
            style({ opacity: 0 }),
            animate('800ms ease-in-out', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [ // Vecchia immagine che esce
            style({ opacity: 1 }),
            animate('800ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      // Animazione iniziale per la prima immagine
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  // Array di URL delle immagini per il carousel
  // SOSTITUISCI QUESTI URL CON LE TUE FOTO REALI
  heroImages: string[] = [
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1752847726/logo_dhzlmi.png',
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1752775011/azzurra-makeup/portfolio/ednmu907ominu29wgj0u.jpg',
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1752944812/SnapInsta.to_468394954_18472014007046517_2476016588489560134_n_lji6e5.jpg',
  ];
  currentHeroImage: string = '';
  currentIndex: number = 0;
  private carouselInterval: Subscription | undefined;
  private isComponentAlive: boolean = true; // Flag per gestire la sottoscrizione

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (this.heroImages.length > 0) {
      this.currentHeroImage = this.heroImages[this.currentIndex];
      if (isPlatformBrowser(this.platformId)) {
        this.startCarousel();
      }
    }
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    if (this.carouselInterval) {
      this.carouselInterval.unsubscribe();
    }
  }

  startCarousel(): void {
    this.carouselInterval = interval(5000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => {
        this.nextImage();
      });
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      this.carouselInterval.unsubscribe();
    }
  }

  prevImage(): void {
    this.stopCarousel();
    this.currentIndex = (this.currentIndex - 1 + this.heroImages.length) % this.heroImages.length;
    this.currentHeroImage = this.heroImages[this.currentIndex]; // Aggiorna l'immagine per l'animazione
    this.startCarousel();
  }

  nextImage(): void {
    this.stopCarousel();
    this.currentIndex = (this.currentIndex + 1) % this.heroImages.length;
    this.currentHeroImage = this.heroImages[this.currentIndex]; // Aggiorna l'immagine per l'animazione
    this.startCarousel();
  }

  // Metodo per la navigazione con i punti
  goToImage(index: number): void {
    this.stopCarousel();
    this.currentIndex = index;
    this.currentHeroImage = this.heroImages[this.currentIndex]; // Aggiorna l'immagine per l'animazione
    this.startCarousel();
  }
}
