// src/app/services/portfolio.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Rimosso 'delay'
import { PortfolioImage, PortfolioItem } from '../pages/portfolio/portfolio-item.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private nextId = 1; // Contatore per ID unici
  private mockPortfolioItems: PortfolioItem[] = [
    {
      id: 'item1',
      title: 'Trucco Sposa Classico',
      subtitle: 'Look naturale e luminoso',
      description: 'Un trucco elegante e senza tempo, perfetto per il giorno più bello.',
      category: 'Sposa',
      images: [
        { src: 'https://placehold.co/600x400/FFC0CB/FFFFFF?text=Sposa1', alt: 'Sposa 1' },
        { src: 'https://placehold.co/600x400/FFC0CB/FFFFFF?text=Sposa2', alt: 'Sposa 2' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item2',
      title: 'Trucco Fotografico Moda',
      subtitle: 'Servizio per rivista',
      description: 'Make-up audace e d\'impatto per shooting fotografici professionali.',
      category: 'Editoriale',
      images: [
        { src: 'https://placehold.co/600x400/E6E6FA/333333?text=Moda1', alt: 'Moda 1' },
        { src: 'https://placehold.co/600x400/E6E6FA/333333?text=Moda2', alt: 'Moda 2' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    const maxId = this.mockPortfolioItems.reduce((max, item) => {
      const idNum = parseInt(item.id?.replace('item', '') || '0');
      return idNum > max ? idNum : max;
    }, 0);
    this.nextId = maxId + 1;
  }

  getPortfolioItems(): Observable<PortfolioItem[]> {
    return of(this.mockPortfolioItems); // Rimosso delay
  }

  getPortfolioItemById(id: string): Observable<PortfolioItem | undefined> {
    const item = this.mockPortfolioItems.find(p => p.id === id);
    return of(item); // Rimosso delay
  }

  addPortfolioItem(
    itemData: Omit<PortfolioItem, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
    newFiles: File[],
    imagesMetadata: PortfolioImage[]
  ): Observable<PortfolioItem> {
    return of(null).pipe(
      // Rimosso delay
      map(() => {
        const newId = `item${this.nextId++}`;
        const uploadedImageUrls: PortfolioImage[] = [];

        const newImagesMetadata = imagesMetadata.filter(img => img.isNew && img.file instanceof File);

        newImagesMetadata.forEach((meta) => {
          const file = meta.file as File;
          const mockUrl = `https://mock-storage.com/images/${newId}/${file.name}`;
          uploadedImageUrls.push({
            src: mockUrl,
            description: meta.description || '',
            alt: meta.alt || file.name,
            isNew: false
          });
        });

        const existingImages = imagesMetadata.filter(img => !img.isNew);
        const finalImages = existingImages.concat(uploadedImageUrls);

        const newItem: PortfolioItem = {
          id: newId,
          ...itemData,
          images: finalImages,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockPortfolioItems.push(newItem);
        console.log('Elemento aggiunto (mock):', newItem);
        return newItem;
      }),
      catchError(err => throwError(() => new Error('Errore simulato durante l\'aggiunta del portfolio: ' + err.message)))
    );
  }

  updatePortfolioItem(
    id: string,
    itemData: Omit<PortfolioItem, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
    newFiles: File[],
    imagesMetadata: PortfolioImage[]
  ): Observable<PortfolioItem> {
    return of(null).pipe(
      // Rimosso delay
      map(() => {
        const index = this.mockPortfolioItems.findIndex(item => item.id === id);
        if (index === -1) {
          throw new Error('Elemento non trovato.');
        }

        const uploadedImageUrls: PortfolioImage[] = [];

        newFiles.forEach(file => {
          const correspondingMetadata = imagesMetadata.find(img => img.isNew && img.file === file);
          const mockUrl = `https://mock-storage.com/images/${id}/${file.name}`;
          uploadedImageUrls.push({
            src: mockUrl,
            description: correspondingMetadata?.description || '',
            alt: correspondingMetadata?.alt || file.name,
            isNew: false
          });
        });

        const existingImages = imagesMetadata.filter(img => !img.isNew);
        const finalImages = existingImages.concat(uploadedImageUrls);

        const updatedItem: PortfolioItem = {
          ...this.mockPortfolioItems[index],
          ...itemData,
          images: finalImages,
          updatedAt: new Date()
        };
        this.mockPortfolioItems[index] = updatedItem;
        console.log('Elemento aggiornato (mock):', updatedItem);
        return updatedItem;
      }),
      catchError(err => throwError(() => new Error('Errore simulato durante l\'aggiornamento del portfolio: ' + err.message)))
    );
  }

  deletePortfolioItem(id: string): Observable<void> {
    return of(null).pipe(
      // Rimosso delay
      map(() => {
        const initialLength = this.mockPortfolioItems.length;
        this.mockPortfolioItems = this.mockPortfolioItems.filter(item => item.id !== id);
        if (this.mockPortfolioItems.length === initialLength) {
          throw new Error('Elemento non trovato per l\'eliminazione.');
        }
        console.log('Elemento eliminato (mock):', id);
      }),
      catchError(err => throwError(() => new Error('Errore simulato durante l\'eliminazione del portfolio: ' + err.message)))
    );
  }
}
