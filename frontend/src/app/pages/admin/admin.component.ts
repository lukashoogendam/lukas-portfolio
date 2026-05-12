import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { AdminProjectsComponent } from './admin-projects/admin-projects';
import { AdminSkillsComponent } from './admin-skills/admin-skills';
import { AdminSocialsComponent } from './admin-socials/admin-socials';
import { AdminProfileComponent } from './admin-profile/admin-profile';

type Tab = 'projects' | 'skills' | 'socials' | 'profile';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule, 
    RouterLink,
    AdminProjectsComponent,
    AdminSkillsComponent,
    AdminSocialsComponent,
    AdminProfileComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  authService = inject(AuthService);
  activeTab = signal<Tab>('projects');

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.authService.logout();
  }
}
