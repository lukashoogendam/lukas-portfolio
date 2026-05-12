import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  PortfolioApiService,
  SkillDto
} from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';

interface SkillGroup {
  category: string;
  skills: SkillDto[];
}

@Component({
  selector: 'app-skills-overview',
  imports: [CommonModule, RouterLink],
  templateUrl: './skills-overview.component.html',
  styleUrl: './skills-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsOverviewComponent {

  skillGroups = signal<SkillGroup[]>([]);
  totalSkills = signal(0);
  isLoading = signal(true);
  hasError = signal(false);

  private apiService = inject(PortfolioApiService);
  private langService = inject(LanguageService);

  constructor() {
    effect(() => {
      this.langService.currentLang();
      this.loadSkills();
    });
  }

  private loadSkills(): void {
    this.isLoading.set(true);
    this.apiService.getSkills().subscribe({
      next: (res) => {
        const skills = res.data;
        this.totalSkills.set(skills.length);
        this.skillGroups.set(this.groupByCategory(skills));
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private groupByCategory(skills: SkillDto[]): SkillGroup[] {
    const map = new Map<string, SkillDto[]>();
    for (const skill of skills) {
      const cat = skill.category ?? 'Overig';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(skill);
    }
    return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }));
  }

  getLevelWidth(level: string): string {
    const map: Record<string, string> = {
      beginner: '25%',
      junior: '40%',
      medior: '60%',
      gevorderd: '75%',
      senior: '90%',
      expert: '100%',
    };
    return map[level?.toLowerCase()] ?? '50%';
  }

  getLevelLabel(level: string): string {
    const map: Record<string, string> = {
      beginner: 'Beginner',
      junior: 'Junior',
      medior: 'Medior',
      gevorderd: 'Gevorderd',
      senior: 'Senior',
      expert: 'Expert',
    };
    return map[level?.toLowerCase()] ?? level ?? '—';
  }
}
