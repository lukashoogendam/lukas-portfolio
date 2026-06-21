import { Component, signal, inject, ChangeDetectionStrategy, computed, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LowerCasePipe, DatePipe } from '@angular/common';
import { PortfolioApiService, HomeDto, SkillDto } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { Title, Meta } from '@angular/platform-browser';
import { ApiTerminalComponent } from '../../shared/components/api-terminal/api-terminal.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ApiTerminalComponent, LowerCasePipe, DatePipe, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  api = inject(PortfolioApiService);
  langService = inject(LanguageService);
  title = inject(Title);
  meta = inject(Meta);
  private destroyRef = inject(DestroyRef);

  homeData = signal<HomeDto | null>(null);

  // Contact form
  contactName = signal('');
  contactEmail = signal('');
  contactMessage = signal('');
  contactSubmitting = signal(false);
  contactSuccess = signal(false);
  contactError = signal<string | null>(null);


  // Group all skills by category
  skillsByCategory = computed(() => {
    const all = this.homeData()?.allSkills ?? [];
    const map = new Map<string, SkillDto[]>();
    for (const skill of all) {
      if (!map.has(skill.category)) map.set(skill.category, []);
      map.get(skill.category)!.push(skill);
    }
    return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }));
  });

  featuredSkills = computed(() => {
    return this.homeData()?.featuredSkills ?? [];
  });

  constructor() {
    toObservable(this.langService.currentLang).pipe(
      switchMap(() => this.api.getHome()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => {
      this.homeData.set(data);
      const name = data?.profile.name || 'Portfolio';
      this.title.setTitle(`${name} | Web Developer`);
      this.meta.updateTag({ name: 'description', content: data?.profile.summary || '' });
    });
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  heroPayload = computed(() => {
    const data = this.homeData();
    if (!data) return {};
    return {
      name: data.profile.name,
      role: data.profile.role,
      focus: data.profile.focus,
      location: data.profile.location,
      skills: data.allSkills.length,
      projects: data.highlightedProjects.length
    };
  });

  aboutPayload = computed(() => {
    const data = this.homeData();
    if (!data) return {};
    return {
      bio: data.profile.summary,
      contact: {
        email: data.profile.email,
        github: "https://github.com/lukas",
        linkedin: "https://linkedin.com/in/lukas"
      }
    };
  });

  skillsPayload = computed(() => {
    const data = this.homeData();
    if (!data) return {};
    return data.allSkills.slice(0, 5).map(s => ({
      name: s.name,
      category: s.category
    }));
  });

  projectsPayload = computed(() => {
    const data = this.homeData();
    if (!data) return {};
    return data.highlightedProjects.map(p => ({
      title: p.title,
      category: p.category,
      status: p.status
    }));
  });


  getTypeIcon(type: string): string {
    switch(type) {
      case 'WORK': return '💼';
      case 'EDUCATION': return '🎓';
      default: return '🌟';
    }
  }

  submitContact(): void {
    if (!this.contactName() || !this.contactEmail() || !this.contactMessage()) return;
    this.contactSubmitting.set(true);
    this.contactError.set('');
    this.api.sendContactMessage({
      name: this.contactName(),
      email: this.contactEmail(),
      message: this.contactMessage()
    }).subscribe({
      next: () => {
        this.contactSubmitting.set(false);
        this.contactSuccess.set(true);
        this.contactName.set('');
        this.contactEmail.set('');
        this.contactMessage.set('');
      },
      error: () => {
        this.contactSubmitting.set(false);
        this.contactError.set(this.langService.t('contact.error'));
      }
    });
  }
}
