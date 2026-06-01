import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'projects', loadComponent: () => import('./pages/projects-overview/projects-overview').then(m => m.ProjectsOverview) },
  { path: 'projects/:slug', loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '' }
];
