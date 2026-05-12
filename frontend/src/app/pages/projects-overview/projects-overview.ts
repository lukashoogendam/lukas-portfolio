import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioApiService, ProjectListDto } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-projects-overview',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects-overview.html',
  styleUrl: './projects-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsOverview {
  projects = signal<ProjectListDto[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  private apiService = inject(PortfolioApiService);
  private langService = inject(LanguageService);

  constructor() {
    // Reload data reactively when language changes
    effect(() => {
      // Access currentLang signal to track it
      this.langService.currentLang();
      this.loadProjects();
    });
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    this.apiService.getProjects().subscribe({
      next: (res) => {
        this.projects.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
