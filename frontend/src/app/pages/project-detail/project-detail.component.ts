import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import {
  PortfolioApiService,
  ProjectDetailDto,
  ApiResponse
} from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { MarkdownPipe } from '../../core/pipes/markdown.pipe';
import { ShowcaseModalComponent } from './showcase-modal/showcase-modal';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, MarkdownPipe, ShowcaseModalComponent],
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
  private location = inject(Location);
  constructor() {
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('slug');
      this.langService.currentLang(); 
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
    if (status === 'Afgerond') return 'completed';
    if (status === 'In ontwikkeling') return 'in-progress';
    return '';
  }

  goBack() : void{
    this.location.back();
  }
}
