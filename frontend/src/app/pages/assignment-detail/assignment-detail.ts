import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PortfolioApiService, AssignmentDto } from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-assignment-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './assignment-detail.html',
  styleUrl: './assignment-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentDetail implements OnInit {
  assignment = signal<AssignmentDto | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  private apiService = inject(PortfolioApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.router.navigate(['/assignments']); return; }

    this.apiService.getAssignmentBySlug(slug).subscribe({
      next: (res) => {
        this.assignment.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

}

