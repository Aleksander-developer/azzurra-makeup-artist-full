// src/app/services/portfolio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Importa HttpClient e HttpHeaders
import { Observable, throwError } from 'rxjs'; // Rimosso 'of'
import { catchError } from 'rxjs/operators';
import { PortfolioImage, PortfolioItem } from '../pages/portfolio/portfolio-item.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // URL del tuo backend deployato su Cloud Run
  private apiUrl = 'https://azzurra-backend-1094999227512.europe-west1.run.app/api'; // <-- NUOVO: URL del Backend
  // La tua chiave API segreta che hai impostato come variabile d'ambiente nel backend
  private apiKey = 'azzu-best-makeup-artist-241217dic'; // <-- NUOVO: La tua API Key

  constructor(private http: HttpClient) { } // <-- NUOVO: Inietta HttpClient

  // Metodo helper per ottenere gli headers con la chiave API
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': this.apiKey // Aggiunge la chiave API all'header
    });
  }

  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.http.get<PortfolioItem[]>(`${this.apiUrl}/portfolio`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getPortfolioItemById(id: string): Observable<PortfolioItem> {
    return this.http.get<PortfolioItem>(`${this.apiUrl}/portfolio/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addPortfolioItem(
    itemData: Omit<PortfolioItem, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
    newFiles: File[],
    imagesMetadata: PortfolioImage[]
  ): Observable<PortfolioItem> {
    const formData = new FormData();

    // Aggiungi i dati dell'elemento al FormData
    // Converti l'oggetto in JSON e poi aggiungilo come stringa
    formData.append('itemData', JSON.stringify(itemData));
    formData.append('imagesMetadata', JSON.stringify(imagesMetadata));

    // Aggiungi i nuovi file al FormData
    newFiles.forEach((file, index) => {
      formData.append(`files`, file, file.name); // 'files' deve corrispondere al nome del campo nel backend (multer)
    });

    return this.http.post<PortfolioItem>(`${this.apiUrl}/portfolio`, formData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updatePortfolioItem(
    id: string,
    itemData: Omit<PortfolioItem, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
    newFiles: File[],
    imagesMetadata: PortfolioImage[]
  ): Observable<PortfolioItem> {
    const formData = new FormData();

    // Aggiungi i dati dell'elemento al FormData
    formData.append('itemData', JSON.stringify(itemData));
    formData.append('imagesMetadata', JSON.stringify(imagesMetadata));

    // Aggiungi i nuovi file al FormData
    newFiles.forEach((file, index) => {
      formData.append(`files`, file, file.name); // 'files' deve corrispondere al nome del campo nel backend (multer)
    });

    return this.http.put<PortfolioItem>(`${this.apiUrl}/portfolio/${id}`, formData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deletePortfolioItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portfolio/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestione degli errori HTTP
  private handleError(error: any): Observable<never> {
    console.error('Errore API:', error);
    let errorMessage = 'Si è verificato un errore sconosciuto.';
    if (error.error instanceof ErrorEvent) {
      // Errore lato client o di rete
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      // Errore lato server
      errorMessage = `Codice errore: ${error.status}\nMessaggio: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = `Codice errore: ${error.status}\nMessaggio: ${error.error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
