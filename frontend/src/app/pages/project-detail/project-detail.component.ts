import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import {
  PortfolioApiService,
  ProjectDetailDto,
  ApiResponse
} from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailComponent {

  project = signal<ProjectDetailDto | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  lightboxImage = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private apiService = inject(PortfolioApiService);
  private sanitizer = inject(DomSanitizer);
  private langService = inject(LanguageService);

  constructor() {
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('slug');
      this.langService.currentLang(); // track language changes
      if (slug) {
        this.loadProject(slug);
      }
    });
  }

  private loadProject(slug: string): void {
    this.apiService.getProjectBySlug(slug).subscribe({
      next: (response) => {
        this.project.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  getSafeEmbedHtml(embedCode?: string): SafeHtml {
    if (!embedCode) return '';
    return this.sanitizer.bypassSecurityTrustHtml(embedCode);
  }

  getSafeDemoUrl(url?: string): SafeResourceUrl {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  openLightbox(imageUrl: string): void {
    this.lightboxImage.set(imageUrl);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  getStatusClass(): string {
    const status = this.project()?.status;
    if (!status) return '';
    if (status === 'Afgerond') return 'completed';
    if (status === 'In ontwikkeling') return 'in-progress';
    return '';
  }
}
