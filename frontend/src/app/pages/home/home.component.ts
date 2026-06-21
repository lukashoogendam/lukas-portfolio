import { Component, signal, inject, computed, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LowerCasePipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioApiService, HomeDto, SkillCategory, SocialDto, TimelineEventDto, FeaturedSkillDto } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { Title, Meta } from '@angular/platform-browser';
import { ApiTerminalComponent } from '../../shared/components/api-terminal/api-terminal.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ApiTerminalComponent, LowerCasePipe, DatePipe, TranslatePipe, ReactiveFormsModule],
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
  socials = signal<SocialDto[]>([]);

  // Contact form (reactive — so the form actually binds and submit fires)
  private fb = inject(FormBuilder);
  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });
  contactSubmitting = signal(false);
  contactSuccess = signal(false);
  contactError = signal<string | null>(null);

  // Full toolkit, grouped by category (alphabetical) for the "Vaardigheden" reference table.
  skillsByCategory = computed(() => {
    const all = this.homeData()?.allSkills ?? [];
    const map = new Map<SkillCategory, string[]>();
    for (const skill of all) {
      if (!map.has(skill.category)) map.set(skill.category, []);
      map.get(skill.category)!.push(skill.name);
    }
    return Array.from(map.entries())
      .map(([category, skills]) => ({ category, skills: skills.sort((a, b) => a.localeCompare(b)) }))
      .sort((a, b) => a.category.localeCompare(b.category));
  });

  featuredSkills = computed(() => this.homeData()?.featuredSkills ?? []);
  totalSkills = computed(() => this.homeData()?.allSkills.length ?? 0);
  totalCategories = computed(() => this.skillsByCategory().length);

  // Tidy JSON payload for the hero terminal — the "GET /api/profile" response.
  heroPayload = computed(() => {
    const p = this.homeData()?.profile;
    if (!p) return {};
    return {
      name: p.name,
      role: p.role,
      focus: p.focus,
      location: p.location,
      available: true
    };
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

    this.api.getSocials().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: socials => this.socials.set(socials),
      error: () => this.socials.set([])
    });
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Icon ids available in the sprite (frontend/src/index.html).
  private static readonly ICON_IDS = new Set([
    'shield', 'cup', 'sprout', 'db', 'code', 'terminal', 'spark', 'globe',
    'mail', 'cap', 'case', 'arrow', 'gh', 'li', 'doc', 'image', 'play', 'puzzle',
    'alert', 'chart', 'chip'
  ]);

  // A featured skill may name its own sprite icon via `icon` (e.g. "shield" or
  // "i-shield"); otherwise fall back to a sensible icon for its category.
  skillIcon(skill: FeaturedSkillDto): string {
    const named = (skill.icon ?? '').trim().toLowerCase().replace(/^#?i-/, '');
    if (HomeComponent.ICON_IDS.has(named)) return `i-${named}`;
    return this.categoryIcon(skill.category);
  }

  private categoryIcon(category: SkillCategory): string {
    switch (category) {
      case 'BACKEND': return 'i-cup';
      case 'FRONTEND': return 'i-code';
      case 'DATABASE': return 'i-db';
      case 'DATA': return 'i-chart';
      case 'DEVOPS': return 'i-terminal';
      case 'CLOUD': return 'i-db';
      case 'MOBILE': return 'i-spark';
      case 'TOOLS':
      default: return 'i-terminal';
    }
  }

  timelineIcon(type: string): string {
    switch (type) {
      case 'EDUCATION': return 'i-cap';
      case 'WORK': return 'i-case';
      default: return 'i-spark';
    }
  }

  socialIcon(platform: string): string {
    const p = platform.toLowerCase();
    if (p.includes('git')) return 'i-gh';
    if (p.includes('linked')) return 'i-li';
    if (p.includes('mail') || p.includes('email')) return 'i-mail';
    return 'i-arrow';
  }

  // Deterministic 7-char "commit hash" for the git-log timeline (no randomness).
  commitHash(event: TimelineEventDto, index: number): string {
    const seed = `${event.title}|${event.startDate ?? ''}|${index}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return h.toString(16).padStart(7, '0').slice(0, 7);
  }

  submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.contactSubmitting.set(true);
    this.contactError.set(null);
    this.api.sendContactMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.contactSubmitting.set(false);
        this.contactSuccess.set(true);
        this.contactForm.reset();
      },
      error: () => {
        this.contactSubmitting.set(false);
        this.contactError.set(this.langService.t('contact.error'));
      }
    });
  }
}
