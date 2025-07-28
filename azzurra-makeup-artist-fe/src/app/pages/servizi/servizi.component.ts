// src/app/pages/servizi/servizi.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Interfaccia per definire la struttura di un servizio
interface ServiceItem {
  id: string; // Un ID unico per il servizio (utile per la randomizzazione e il tracciamento)
  titleKey: string; // Chiave di traduzione per il titolo
  subtitleKey: string; // Chiave di traduzione per il sottotitolo
  descriptionKey: string; // Chiave di traduzione per la descrizione
  buttonAriaKey: string; // Chiave di traduzione per l'aria-label del bottone
  images: string[]; // Array di URL delle immagini per il carousel
  imageAltKey: string; // Chiave di traduzione per l'alt text delle immagini
  currentIndex: number; // Indice dell'immagine corrente nel carousel
}

@Component({
  selector: 'app-servizi',
  templateUrl: './servizi.component.html',
  styleUrls: ['./servizi.component.scss']
})
export class ServiziComponent implements OnInit, OnDestroy {

  // Array dei servizi con le relative immagini e chiavi di traduzione
  services: ServiceItem[] = [
    {
      id: 'ceremony',
      titleKey: '@@serviziCeremonyTitle', // Usiamo ID i18n diretti
      subtitleKey: '@@serviziCeremonySubtitle',
      descriptionKey: '@@serviziCeremonyDescription',
      buttonAriaKey: '@@serviziCeremonyButtonAria',
      images: [
        'assets/Trucco Eventi & Servizi Fotografici.png', // Sostituisci con le tue immagini reali
        'assets/trucco-cerimonia.png',
        'assets/trucco-sposa-standard.png'
        // Aggiungi qui altri percorsi di immagini per la cerimonia
      ],
      imageAltKey: 'Alt text per Trucco Cerimonia', // Testo alt diretto, verrà estratto
      currentIndex: 0
    },
    {
      id: 'events',
      titleKey: '@@serviziEventsTitle', // Usiamo ID i18n diretti
      subtitleKey: '@@serviziEventsSubtitle',
      descriptionKey: '@@serviziEventsDescription',
      buttonAriaKey: '@@serviziEventsButtonAria',
      images: [
        'assets/Trucco Eventi & Servizi Fotografici.png', // Sostituisci con le tue immagini reali
        'assets/trucco-cerimonia.png',
        'assets/trucco-sposa-standard.png'
        // Aggiungi qui altri percorsi di immagini per eventi/fotografici
      ],
      imageAltKey: 'Alt text per Trucco Eventi e Fotografico', // Testo alt diretto, verrà estratto
      currentIndex: 0
    }
  ];

  isFullscreen: boolean = false;
  fullscreenImageUrl: string = '';
  fullscreenImageAlt: string = '';
  // langChangeSubscription non è più necessario con i18n nativo
  private langChangeSubscription: Subscription | undefined; // Mantenuto per compatibilità se c'erano altre sottoscrizioni

  constructor() { } // Rimosso TranslateService

  ngOnInit(): void {
    // Randomizza l'ordine delle immagini per ogni servizio all'inizializzazione
    this.services.forEach(service => {
      this.shuffleArray(service.images);
      service.currentIndex = 0; // Assicurati che l'indice parta da 0 dopo la randomizzazione
    });

    // Rimosso this.translate.onLangChange.subscribe()
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  /**
   * Mescola un array in modo casuale (algoritmo Fisher-Yates).
   * @param array L'array da mescolare.
   */
  private shuffleArray(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Scambia gli elementi
    }
  }

  /**
   * Passa all'immagine precedente nel carousel di un servizio specifico.
   * @param service Il servizio di cui aggiornare il carousel.
   */
  prevImage(service: ServiceItem): void {
    service.currentIndex = (service.currentIndex - 1 + service.images.length) % service.images.length;
  }

  /**
   * Passa all'immagine successiva nel carousel di un servizio specifico.
   * @param service Il servizio di cui aggiornare il carousel.
   */
  nextImage(service: ServiceItem): void {
    service.currentIndex = (service.currentIndex + 1) % service.images.length;
  }

  /**
   * Apre la modalità fullscreen per un'immagine specifica.
   * @param imageUrl L'URL dell'immagine da visualizzare in fullscreen.
   * @param imageAlt La stringa (già tradotta o base) dell'alt text dell'immagine.
   */
  openFullscreen(imageUrl: string, imageAlt: string): void {
    this.fullscreenImageUrl = imageUrl;
    this.fullscreenImageAlt = imageAlt; // Ora imageAlt è già la stringa da usare
    this.isFullscreen = true;
    // Opzionale: blocca lo scroll del body quando il fullscreen è attivo
    document.body.style.overflow = 'hidden';
  }

  /**
   * Chiude la modalità fullscreen.
   */
  closeFullscreen(): void {
    this.isFullscreen = false;
    this.fullscreenImageUrl = '';
    this.fullscreenImageAlt = '';
    // Opzionale: ripristina lo scroll del body
    document.body.style.overflow = '';
  }
}
