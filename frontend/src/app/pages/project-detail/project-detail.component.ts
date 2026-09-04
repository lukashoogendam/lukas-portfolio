import { Component, signal, inject, DestroyRef, OnDestroy } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap, map, filter, catchError, EMPTY } from 'rxjs';
import {
  PortfolioApiService,
  ProjectDetailDto,
  ShowcaseDto,
} from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { MarkdownPipe } from '../../core/pipes/markdown.pipe';
import { ShowcaseModalComponent } from './showcase-modal/showcase-modal';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LoadingErrorStateComponent } from '../../shared/components/loading-error-state/loading-error-state.component';

@Component({
  selector: 'app-project-detail',
  imports: [MarkdownPipe, ShowcaseModalComponent, TranslatePipe, LoadingErrorStateComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnDestroy {
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
    let previousSlug: string | null = null;
    combineLatest([
      this.route.paramMap.pipe(map((params) => params.get('slug'))),
      toObservable(this.langService.currentLang)
    ]).pipe(
      map(([slug]) => slug),
      filter((slug): slug is string => !!slug),
      switchMap((slug) => {
        const slugChanged = slug !== previousSlug;
        previousSlug = slug;
        this.project.set(null);
        this.hasError.set(false);
        this.isLoading.set(true);
        if (slugChanged) {
          this.lightboxImage.set(null);
          this.activeShowcaseModal.set(null);
          document.body.style.overflow = '';
        }
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

  activeShowcaseModal = signal<ShowcaseDto | null>(null);

  openShowcaseModal(sc: ShowcaseDto): void {
    this.activeShowcaseModal.set(sc);
    document.body.style.overflow = 'hidden';
  }

  closeShowcaseModal(): void {
    this.activeShowcaseModal.set(null);
    document.body.style.overflow = '';
  }

  ngOnDestroy(): void {
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
