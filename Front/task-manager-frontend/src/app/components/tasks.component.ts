import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-tasks',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="tasks-center-wrapper">
      <mat-card class="tasks-card">
        <div class="tasks-header">
          <h2>Мои задачи</h2>
          <button mat-raised-button color="warn" (click)="logout()">Выйти</button>
        </div>
        <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="task-form">
          <mat-form-field appearance="outline" class="task-field">
            <mat-label>Название задачи</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="task-field">
            <mat-label>Описание</mat-label>
            <input matInput formControlName="description" />
          </mat-form-field>
          <mat-checkbox formControlName="isCompleted">Выполнено</mat-checkbox>
          <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid" class="add-btn">Добавить</button>
        </form>
        <mat-divider></mat-divider>
        <div *ngFor="let task of tasks" class="task-item">
          <mat-card class="task-inner-card">
            <div *ngIf="editTaskId !== task.id" class="task-view">
              <div class="task-title-desc">
                <span [style.text-decoration]="task.isCompleted ? 'line-through' : 'none'">
                  <strong>{{ task.title }}</strong>
                </span>
                <span *ngIf="task.isCompleted" class="done-label">[Выполнено]</span>
                <div class="desc">{{ task.description }}</div>
              </div>
              <div class="task-actions">
                <button mat-icon-button color="primary" (click)="startEdit(task)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTask(task)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <div *ngIf="editTaskId === task.id" class="task-edit">
              <form [formGroup]="editForm" (ngSubmit)="saveEdit(task)">
                <mat-form-field appearance="outline" class="task-field">
                  <mat-label>Название задачи</mat-label>
                  <input matInput formControlName="title" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="task-field">
                  <mat-label>Описание</mat-label>
                  <input matInput formControlName="description" />
                </mat-form-field>
                <mat-checkbox formControlName="isCompleted">Выполнено</mat-checkbox>
                <button mat-raised-button color="primary" type="submit" [disabled]="editForm.invalid">Сохранить</button>
                <button mat-button type="button" (click)="cancelEdit()">Отмена</button>
              </form>
            </div>
          </mat-card>
        </div>
      </mat-card>
    </div>
  `
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  taskForm: FormGroup;
  editForm: FormGroup;
  editTaskId: number | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isCompleted: [false]
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isCompleted: [false]
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.snackBar.open('Вы не авторизованы!', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Task[]>('http://localhost:5098/api/task', { headers }).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Ошибка загрузки задач', 'OK', { duration: 3000 });
      }
    });
  }

  addTask() {
    if (this.taskForm.invalid) return;

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.snackBar.open('Вы не авторизованы!', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<Task>('http://localhost:5098/api/task', this.taskForm.value, { headers }).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.taskForm.reset({ title: '', description: '', isCompleted: false });
        this.snackBar.open('Задача добавлена!', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Ошибка добавления задачи', 'OK', { duration: 3000 });
      }
    });
  }

  startEdit(task: Task) {
    this.editTaskId = task.id;
    this.editForm.setValue({
      title: task.title,
      description: task.description || '',
      isCompleted: task.isCompleted
    });
  }

  saveEdit(task: Task) {
    if (this.editForm.invalid) return;

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.snackBar.open('Вы не авторизованы!', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const updatedTask = {
      ...task,
      ...this.editForm.value
    };

    this.http.put(`http://localhost:5098/api/task/${task.id}`, updatedTask, { headers }).subscribe({
      next: () => {
        Object.assign(task, this.editForm.value);
        this.editTaskId = null;
        this.snackBar.open('Задача обновлена!', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Ошибка редактирования задачи', 'OK', { duration: 3000 });
      }
    });
  }

  cancelEdit() {
    this.editTaskId = null;
  }

  deleteTask(task: Task) {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.snackBar.open('Вы не авторизованы!', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:5098/api/task/${task.id}`, { headers }).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.snackBar.open('Задача удалена!', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Ошибка удаления задачи', 'OK', { duration: 3000 });
      }
    });
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
