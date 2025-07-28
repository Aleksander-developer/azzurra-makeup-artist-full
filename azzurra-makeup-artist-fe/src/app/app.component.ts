import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Azzurra Angius Makeup Artist';
  showScrollButton: boolean = false;
  scrollButtonBottom: number = 30;
  isButtonOverFooter: boolean = false;

  @ViewChild('footerRef') footerRef!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.lang = 'it'; // puoi aggiornare dinamicamente se necessario
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen('window', 'scroll', () => this.onWindowScroll());
      this.renderer.listen('window', 'resize', () => this.updateScrollButtonPosition());
      this.updateScrollButtonPosition();
    }
  }

  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.showScrollButton = scrollY > 100;
      this.updateScrollButtonPosition();
    }
  }

  updateScrollButtonPosition(): void {
    if (!this.footerRef?.nativeElement || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const footerEl = this.footerRef.nativeElement as HTMLElement;
    const footerRect = footerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const defaultButtonMargin = 30;

    if (footerRect.top < viewportHeight) {
      const visibleFooterHeight = viewportHeight - footerRect.top;
      this.scrollButtonBottom = Math.max(defaultButtonMargin, visibleFooterHeight + 10);
      this.isButtonOverFooter = true;
    } else {
      this.scrollButtonBottom = defaultButtonMargin;
      this.isButtonOverFooter = false;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}
