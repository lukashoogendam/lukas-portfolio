import { Component, signal, inject, DestroyRef } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap, map, filter, catchError, EMPTY } from 'rxjs';
import {
  PortfolioApiService,
  ProjectDetailDto,
} from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { MarkdownPipe } from '../../core/pipes/markdown.pipe';
import { ShowcaseModalComponent } from './showcase-modal/showcase-modal';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-project-detail',
  imports: [MarkdownPipe, ShowcaseModalComponent, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  project = signal<ProjectDetailDto | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  lightboxImage = signal<string | null>(null);
  private route = inject(ActivatedRoute);
  private apiService = inject(PortfolioApiService);
  langService = inject(LanguageService);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  constructor() {
    combineLatest([
      this.route.paramMap.pipe(map((params) => params.get('slug'))),
      toObservable(this.langService.currentLang)
    ]).pipe(
      map(([slug]) => slug),
      filter((slug): slug is string => !!slug),
      switchMap((slug) => {
        this.project.set(null);
        this.hasError.set(false);
        this.isLoading.set(true);
        return this.apiService.getProjectBySlug(slug).pipe(
          catchError(() => {
            this.hasError.set(true);
            this.isLoading.set(false);
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((response) => {
      this.project.set(response);
      this.isLoading.set(false);
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
    if (status === 'COMPLETED') return 'completed';
    if (status === 'IN_PROGRESS') return 'in-progress';
    return '';
  }

  goBack(): void {
    this.location.back();
  }
}
