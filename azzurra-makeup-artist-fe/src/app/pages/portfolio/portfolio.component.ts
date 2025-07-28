// src/app/pages/portfolio/portfolio.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { PortfolioItem } from './portfolio-item.model';

// Importa $localize
declare const $localize: any;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolioItems: PortfolioItem[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  private portfolioSubscription: Subscription | undefined;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadPortfolioItems();
  }

  ngOnDestroy(): void {
    if (this.portfolioSubscription) {
      this.portfolioSubscription.unsubscribe();
    }
  }

  loadPortfolioItems(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.portfolioSubscription = this.portfolioService.getPortfolioItems().subscribe({
      next: (items: PortfolioItem[]) => {
        this.portfolioItems = items.map(item => ({
          ...item,
          coverImageUrl: this.getPrecalculatedCoverImage(item)
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = $localize`:@@portfolioLoadError:Errore nel caricamento degli elementi del portfolio: ${err.message || 'Errore sconosciuto.'}`;
        this.isLoading = false;
        console.error('Errore nel caricamento del portfolio:', err);
      }
    });
  }

  private getPrecalculatedCoverImage(item: PortfolioItem): string {
    if (item.images && item.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * item.images.length);
      return item.images[randomIndex].src || 'assets/placeholder.jpg';
    }
    return 'assets/placeholder.jpg';
  }
}

