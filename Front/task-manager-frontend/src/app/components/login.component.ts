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

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss', './login-register-mobile.scss'],
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
    MatIconModule
  ],
  template: `
    <div class="center-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Вход в систему</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Имя пользователя</mat-label>
              <input matInput formControlName="username" />
              <mat-icon matPrefix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                Имя пользователя обязательно
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Пароль</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" />
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Пароль обязателен
              </mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid" class="login-button">
              <mat-icon>login</mat-icon> Войти
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <div class="register-link">
            Нет аккаунта? <a routerLink="/register" class="register-button">Зарегистрироваться</a>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .center-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      border-radius: 12px;
      background-color: white;
    }
    mat-card-header {
      justify-content: center;
      margin-bottom: 24px;
      padding: 0;
    }
    mat-card-title {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      text-align: center;
      margin: 0 auto;
    }
    .login-form {
      display: flex;
      flex-direction: column;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .login-button {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      margin-top: 8px;
      border-radius: 6px;
      height: 48px;
    }
    .register-link {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #666;
    }
    .register-button {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
      margin-left: 4px;
    }
    .register-button:hover {
      text-decoration: underline;
    }
  `
]})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Вход выполнен!', 'OK', { duration: 2000 });
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        const msg = this.extractErrorMessage(err);
        this.snackBar.open(msg, 'OK', { duration: 3000 });
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
