// src/app/pages/portfolio/portfolio-detail/portfolio-detail.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PortfolioService } from '../../../services/portfolio.service';
import { PortfolioItem } from '../portfolio-item.model';

// Importa $localize
declare const $localize: any;

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent implements OnInit, OnDestroy {
  portfolioItem: PortfolioItem | undefined;
  isLoading = true;
  errorMessage: string | null = null;
  currentImageIndex: number = 0; // Per il carousel normale
  private routeSubscription: Subscription | undefined;

  // Nuove proprietà per la galleria fullscreen
  showFullscreen: boolean = false;
  fullscreenImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService,
    @Inject(PLATFORM_ID) private platformId: Object // Inietta PLATFORM_ID
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPortfolioItem(id);
      } else {
        this.errorMessage = $localize`:@@portfolioDetailIdNotFound:ID portfolio non fornito.`;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    // Assicurati di ripristinare lo scroll del body se il componente viene distrutto
    // mentre la fullscreen è attiva, ma solo nel browser.
    if (isPlatformBrowser(this.platformId) && this.showFullscreen) {
      document.body.style.overflow = '';
    }
  }

  loadPortfolioItem(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.portfolioService.getPortfolioItemById(id).subscribe({
      next: (item) => {
        if (item) {
          this.portfolioItem = item;
          this.isLoading = false;
          this.currentImageIndex = 0; // Resetta l'indice del carousel al caricamento
        } else {
          this.errorMessage = $localize`:@@portfolioDetailItemNotFound:Elemento portfolio non trovato.`;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = $localize`:@@portfolioDetailLoadError:Errore nel caricamento dell'elemento: ${err.message || 'Errore sconosciuto.'}`;
        this.isLoading = false;
        console.error('Errore caricamento dettaglio portfolio:', err);
      }
    });
  }

  prevImage(): void {
    if (this.portfolioItem && this.portfolioItem.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.portfolioItem.images.length) % this.portfolioItem.images.length;
    }
  }

  nextImage(): void {
    if (this.portfolioItem && this.portfolioItem.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.portfolioItem.images.length;
    }
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }

  // Metodi per la galleria fullscreen
  openFullscreen(index: number): void {
    this.fullscreenImageIndex = index;
    this.showFullscreen = true;
    if (isPlatformBrowser(this.platformId)) { // Protezione SSR
      document.body.style.overflow = 'hidden'; // Impedisce lo scroll del body
    }
  }

  closeFullscreen(): void {
    this.showFullscreen = false;
    if (isPlatformBrowser(this.platformId)) { // Protezione SSR
      document.body.style.overflow = ''; // Ripristina lo scroll del body
    }
  }

  prevFullscreenImage(event: Event): void {
    event.stopPropagation(); // Impedisce che il click chiuda la fullscreen
    if (this.portfolioItem && this.portfolioItem.images.length > 0) {
      this.fullscreenImageIndex = (this.fullscreenImageIndex - 1 + this.portfolioItem.images.length) % this.portfolioItem.images.length;
    }
  }

  nextFullscreenImage(event: Event): void {
    event.stopPropagation(); // Impedisce che il click chiuda la fullscreen
    if (this.portfolioItem && this.portfolioItem.images.length > 0) {
      this.fullscreenImageIndex = (this.fullscreenImageIndex + 1) % this.portfolioItem.images.length;
    }
  }
}

