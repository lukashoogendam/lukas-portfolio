import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { AdminProjectsComponent } from './admin-projects/admin-projects';
import { AdminSkillsComponent } from './admin-skills/admin-skills';
import { AdminSocialsComponent } from './admin-socials/admin-socials';
import { AdminHomeOverviewComponent } from './admin-home-overview/admin-home-overview';
import { AdminFeaturedSkillsComponent } from './admin-featured-skills/admin-featured-skills';

type Tab = 'home-builder' | 'projects' | 'skills' | 'featured-skills' | 'socials';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink,
    AdminProjectsComponent,
    AdminSkillsComponent,
    AdminSocialsComponent,
    AdminHomeOverviewComponent,
    AdminFeaturedSkillsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  authService = inject(AuthService);
  activeTab = signal<Tab>('home-builder');

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.authService.logout();
  }
}
