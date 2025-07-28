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
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

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
    this.errorMessage = null;
    this.successMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
      this.errorMessage = 'Per favore, compila tutti i campi richiesti.';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Accesso effettuato con successo!';
        // Reindirizza l'utente alla pagina del portfolio manager
        this.router.navigate(['/admin']); // MODIFICATO: Reindirizza alla rotta base di admin
      },
      error: (error) => {
        this.isLoading = false;
        if (error.message === 'Credenziali non valide.') {
          this.errorMessage = 'Email o password non valide.';
        } else if (error.message === 'Il tuo account è stato disabilitato.') {
          this.errorMessage = 'Il tuo account è stato disabilitato.';
        } else {
          this.errorMessage = error.message || 'Si è verificato un errore durante l\'accesso. Riprova.';
        }
        console.error('Errore di login:', error);
      }
    });
  }
}

