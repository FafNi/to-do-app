import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { TasksComponent } from './components/tasks.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];