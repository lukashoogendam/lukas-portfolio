import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'projects', loadComponent: () => import('./pages/projects-overview/projects-overview').then(m => m.ProjectsOverview) },
  { path: 'projects/:slug', loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: '**', redirectTo: '' }
];
