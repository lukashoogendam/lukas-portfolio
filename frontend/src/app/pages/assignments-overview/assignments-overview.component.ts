import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  PortfolioApiService,
  AssignmentDto
} from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-assignments-overview',
  imports: [CommonModule, RouterLink],
  templateUrl: './assignments-overview.component.html',
  styleUrl: './assignments-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentsOverviewComponent {

  assignments = signal<AssignmentDto[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  private apiService = inject(PortfolioApiService);
  private langService = inject(LanguageService);

  constructor() {
    effect(() => {
      this.langService.currentLang();
      this.loadAssignments();
    });
  }

  private loadAssignments(): void {
    this.isLoading.set(true);
    this.apiService.getAssignments().subscribe({
      next: (res) => {
        this.assignments.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
