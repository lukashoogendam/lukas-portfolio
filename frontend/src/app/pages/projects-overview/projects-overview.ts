import { Component, signal, computed, inject, effect } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioApiService, ProjectListDto, ProjectCategory } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
@Component({
  selector: 'app-projects-overview',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './projects-overview.html',
  styleUrl: './projects-overview.scss'
})
export class ProjectsOverview {
  projects = signal<ProjectListDto[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  activeCategory = signal<'ALL' | ProjectCategory>('ALL');

  private apiService = inject(PortfolioApiService);
  private langService = inject(LanguageService);
  private location = inject(Location);

  readonly categoryValues: ('ALL' | ProjectCategory)[] = ['ALL', 'SCHOOL_PROJECT', 'PERSONAL_PROJECT'];

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'ALL') return this.projects();
    return this.projects().filter(p => p.category === cat);
  });

  constructor() {
    effect(() => {
      this.langService.currentLang();
      this.loadProjects();
    });
  }

  setCategory(cat: 'ALL' | ProjectCategory): void {
    this.activeCategory.set(cat);
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    this.apiService.getProjects().subscribe({
      next: (res) => {
        this.projects.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
