import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.scss', './login-register-mobile.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="center-wrapper">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <h2 class="auth-title">Регистрация</h2>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Имя пользователя</mat-label>
              <input matInput formControlName="username" autocomplete="username" />
              <mat-icon matPrefix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                Имя пользователя обязательно
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                Минимум 3 символа
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Пароль</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'" 
                formControlName="password"
                autocomplete="new-password" 
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword = !hidePassword" 
                [attr.aria-label]="'Показать пароль'" 
                [attr.aria-pressed]="!hidePassword"
              >
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Пароль обязателен
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Минимум 6 символов
              </mat-error>
            </mat-form-field>
            
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="submit-button" 
              [disabled]="registerForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
              <span *ngIf="!isLoading">Зарегистрироваться</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-divider></mat-divider>
        
        <mat-card-actions class="card-actions">
          <span>Уже есть аккаунт?</span>
          <a mat-button color="accent" routerLink="/login">Войти</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .center-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
      background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .auth-card {
      width: 100%;
      max-width: 420px;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .auth-title {
      margin: 0;
      text-align: center;
      font-weight: 500;
      color: #333;
      padding: 16px 0;
      font-size: 24px;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      padding: 16px 24px 24px;
    }
    
    .form-field {
      margin-bottom: 16px;
    }
    
    .submit-button {
      height: 48px;
      font-size: 16px;
      margin-top: 24px;
      position: relative;
      border-radius: 24px;
      transition: all 0.3s ease;
    }
    
    .submit-button:not([disabled]):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .card-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      gap: 8px;
      background-color: rgba(0, 0, 0, 0.02);
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    const { username, password } = this.registerForm.value;

    this.authService.register({ username, password }).subscribe({
      next: (res) => {
        this.snackBar.open('Регистрация успешна! Входим...', 'OK', { 
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        
        // Автоматический вход после регистрации
        this.authService.login({ username, password }).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            this.isLoading = false;
            this.snackBar.open('Ошибка автоматического входа', 'OK', { 
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        const msg = this.extractErrorMessage(err);
        this.snackBar.open(msg, 'OK', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  private extractErrorMessage(err: any): string {
    if (!err) return 'Неизвестная ошибка';
    if (typeof err === 'string') return err;
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (typeof err.error === 'object' && err.error.message) return err.error.message;
      if (typeof err.error === 'object') return JSON.stringify(err.error);
    }
    if (err.message) return err.message;
    return JSON.stringify(err);
  }
}
