import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'explorer', loadComponent: () => import('./pages/api-explorer/api-explorer.component').then(m => m.ApiExplorerComponent) },
  { path: 'projects', loadComponent: () => import('./pages/projects-overview/projects-overview').then(m => m.ProjectsOverview) },
  { path: 'projects/:slug', loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile-detail/profile-detail.component').then(m => m.ProfileDetailComponent) },
  { path: 'skills', loadComponent: () => import('./pages/skills-overview/skills-overview.component').then(m => m.SkillsOverviewComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '' }
];
