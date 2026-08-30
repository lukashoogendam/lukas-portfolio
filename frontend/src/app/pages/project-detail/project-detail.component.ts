import { Component, signal, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { MarkdownPipe } from '../../core/pipes/markdown.pipe';
import { ShowcaseModalComponent } from './showcase-modal/showcase-modal';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { loadOnLangChange } from '../../core/composables/load-on-lang-change';

@Component({
  selector: 'app-project-detail',
  imports: [MarkdownPipe, ShowcaseModalComponent, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private apiService = inject(PortfolioApiService);
  langService = inject(LanguageService);
  private location = inject(Location);

  private projectResource = loadOnLangChange(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    return slug ? this.apiService.getProjectBySlug(slug) : EMPTY;
  });
  project = this.projectResource.data;
  isLoading = this.projectResource.isLoading;
  hasError = this.projectResource.hasError;

  lightboxImage = signal<string | null>(null);

  openLightbox(imageUrl: string): void {
    this.lightboxImage.set(imageUrl);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  activeShowcaseModal = signal<any | null>(null);

  openShowcaseModal(sc: any): void {
    this.activeShowcaseModal.set(sc);
    document.body.style.overflow = 'hidden';
  }

  closeShowcaseModal(): void {
    this.activeShowcaseModal.set(null);
    document.body.style.overflow = '';
  }

  getStatusClass(): string {
    const status = this.project()?.status;
    if (!status) return '';
    if (status === 'COMPLETED') return 'completed';
    if (status === 'IN_PROGRESS') return 'in-progress';
    return '';
  }

  goBack(): void {
    this.location.back();
  }
}
