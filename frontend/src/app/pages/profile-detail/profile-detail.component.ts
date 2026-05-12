import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  PortfolioApiService,
  Profile,
  SocialDto
} from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-profile-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-detail.component.html',
  styleUrl: './profile-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDetailComponent implements OnInit {

  profile = signal<Profile | null>(null);
  socials = signal<SocialDto[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  private apiService = inject(PortfolioApiService);

  ngOnInit(): void {
    this.apiService.getProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.loadSocials();
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private loadSocials(): void {
    this.apiService.getSocials().subscribe({
      next: (res) => {
        this.socials.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      github: '⌨',
      linkedin: '💼',
      twitter: '🐦',
      instagram: '📷',
      youtube: '▶',
    };
    return icons[platform.toLowerCase()] ?? '🔗';
  }
}
