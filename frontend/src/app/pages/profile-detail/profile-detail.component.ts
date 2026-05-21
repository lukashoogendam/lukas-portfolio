import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  PortfolioApiService,
  Profile,
  SocialDto,
  SkillDto
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
  skills = signal<SkillDto[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  private apiService = inject(PortfolioApiService);
  private sanitizer = inject(DomSanitizer);
  private location = inject(Location);
  ngOnInit(): void {
    this.apiService.getProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.loadSocials();
        this.loadSkills();
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
  private loadSkills(): void {
    this.apiService.getSkills().subscribe({
      next: (res) => {
        this.skills.set(res.data);
      },
      error: () => {
      }
    });
  }
  getSocialIcon(platform: string): SafeHtml {
    const key = platform.toLowerCase();
    let svgStr = '';
    // GitHub SVG
    if (key.includes('github')) {
      svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
    }
    else if (key.includes('linkedin')) {
      svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;
    }
    else if (key.includes('twitter') || key.includes('x')) {
      svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`;
    }
    else if (key.includes('instagram') || key.includes('insta')) {
      svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
    }
    else {
      svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svgStr);
  }

  goBack() : void{
    this.location.back();
  }
}
