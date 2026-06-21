import { Component, signal, computed, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PortfolioApiService, ProjectListDto, ProjectCategory } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
@Component({
  selector: 'app-projects-overview',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './projects-overview.html',
  styleUrl: './projects-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsOverview {
  projects = signal<ProjectListDto[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  activeCategory = signal<'ALL' | ProjectCategory>('ALL');

  private apiService = inject(PortfolioApiService);
  private langService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  skillFilter = signal<string | null>(null);

  readonly categoryValues: ('ALL' | ProjectCategory)[] = ['ALL', 'SCHOOL_PROJECT', 'PERSONAL_PROJECT'];

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'ALL') return this.projects();
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

  setCategory(cat: 'ALL' | ProjectCategory): void {
    this.activeCategory.set(cat);
  }

  private loadProjects(skill: string | null): void {
    this.isLoading.set(true);
    const request = skill
      ? this.apiService.getProjectsBySkill(skill)
      : this.apiService.getProjects();
    request.subscribe({
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
