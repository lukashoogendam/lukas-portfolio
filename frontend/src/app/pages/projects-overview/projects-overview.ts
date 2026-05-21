import { Component, signal, computed, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
  activeCategory = signal<string>('Alles');

  private apiService = inject(PortfolioApiService);
  private langService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  skillFilter = signal<string | null>(null);

  readonly categories = ['Alles', 'Schoolproject', 'Eigen project'];

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'Alles') return this.projects();
    return this.projects().filter(p => p.category === cat);
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.skillFilter.set(params['skill'] || null);
    });
    effect(() => {
      this.langService.currentLang();
      this.loadProjects(this.skillFilter());
    });
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  private loadProjects(skill: string | null): void {
    this.isLoading.set(true);
    const request = skill
      ? this.apiService.getProjectsBySkill(skill)
      : this.apiService.getProjects();
    request.subscribe({
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

  goBack(): void {
    this.location.back();
  }
}
