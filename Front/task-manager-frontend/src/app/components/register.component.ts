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

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card style="max-width: 400px; margin: 2em auto;">
      <h2 style="text-align:center;">Регистрация</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 1em;">
        <mat-form-field appearance="outline">
          <mat-label>Имя пользователя</mat-label>
          <input matInput formControlName="username" />
          <mat-error *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
            Имя пользователя обязательно
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Пароль</mat-label>
          <input matInput type="password" formControlName="password" />
          <mat-error *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            Пароль обязателен
          </mat-error>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">Зарегистрироваться</button>
      </form>
      <div style="text-align:center; margin-top:1em;">
        Уже есть аккаунт? <a routerLink="/login">Войти</a>
      </div>
    </mat-card>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, password } = this.registerForm.value;

    this.authService.register({ username, password }).subscribe({
      next: (res) => {
        this.snackBar.open('Регистрация успешна! Входим...', 'OK', { duration: 2000 });
        // Автоматический вход после регистрации
        this.authService.login({ username, password }).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            this.snackBar.open('Ошибка автоматического входа', 'OK', { duration: 3000 });
          }
        });
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
