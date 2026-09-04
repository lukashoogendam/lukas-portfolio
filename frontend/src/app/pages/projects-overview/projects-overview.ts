import { Component, signal, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioApiService, ProjectCategory } from '../../core/services/portfolio-api.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LoadingErrorStateComponent } from '../../shared/components/loading-error-state/loading-error-state.component';
import { loadOnLangChange } from '../../core/composables/load-on-lang-change';
@Component({
  selector: 'app-projects-overview',
  imports: [RouterLink, TranslatePipe, LoadingErrorStateComponent],
  templateUrl: './projects-overview.html',
  styleUrl: './projects-overview.scss'
})
export class ProjectsOverview {
  private apiService = inject(PortfolioApiService);
  private location = inject(Location);

  private projectsResource = loadOnLangChange(() => this.apiService.getProjects());
  projects = computed(() => this.projectsResource.data() ?? []);
  isLoading = this.projectsResource.isLoading;
  hasError = this.projectsResource.hasError;

  activeCategory = signal<'ALL' | ProjectCategory>('ALL');

  readonly categoryValues: ('ALL' | ProjectCategory)[] = ['ALL', 'SCHOOL_PROJECT', 'PERSONAL_PROJECT'];

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'ALL') return this.projects();
    return this.projects().filter(p => p.category === cat);
  });

  setCategory(cat: 'ALL' | ProjectCategory): void {
    this.activeCategory.set(cat);
  }

  goBack(): void {
    this.location.back();
  }
}
