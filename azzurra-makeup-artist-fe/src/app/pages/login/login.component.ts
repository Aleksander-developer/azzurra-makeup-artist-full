// src/app/pages/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Il ! indica che sarà inizializzato in ngOnInit
  hidePassword = true; // Per mostrare/nascondere la password
  isLoading = false; // Stato di caricamento per il bottone
  errorMessage: string | null = null; // Messaggio di errore dall'API
  successMessage: string | null = null; // Messaggio di successo (raro per login, ma per consistenza)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null; // Resetta i messaggi ad ogni tentativo
    this.successMessage = null;

    if (this.loginForm.invalid) {
      // Marca tutti i campi come touched per mostrare gli errori di validazione
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
      this.errorMessage = 'Per favore, compila tutti i campi richiesti.'; // Messaggio fisso
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Accesso effettuato con successo!'; // Messaggio fisso
        // Reindirizza l'utente a una pagina protetta, ad esempio il portfolio manager
        this.router.navigate(['/admin/dashboard']); // Reindirizza alla dashboard admin
      },
      error: (error) => {
        this.isLoading = false;
        // Gestisci diversi tipi di errore dall'API
        if (error.message === 'Credenziali non valide.') { // Confronta il messaggio d'errore del mock service
          this.errorMessage = 'Email o password non valide.';
        } else if (error.message === 'Il tuo account è stato disabilitato.') { // Esempio per altri errori
          this.errorMessage = 'Il tuo account è stato disabilitato.';
        } else {
          this.errorMessage = error.message || 'Si è verificato un errore durante l\'accesso. Riprova.';
        }
        console.error('Errore di login:', error);
      }
    });
  }
}
