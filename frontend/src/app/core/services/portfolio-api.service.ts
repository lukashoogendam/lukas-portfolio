import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService, Language } from './language.service';

export type ProjectCategory = 'SCHOOL_PROJECT' | 'PERSONAL_PROJECT';
export type ProjectStatus = 'COMPLETED' | 'IN_PROGRESS';
export type SkillCategory = 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'DEVOPS' | 'TOOLS' | 'MOBILE' | 'CLOUD';

// ─────────────────────────────────────────────────────────────────────────────
// Public DTOs — consumed by components. Already localized to plain strings,
// so the bilingual structure never leaks past this service.
// ─────────────────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  role: string;
  focus: string;
  location: string;
  email: string;
  summary: string;
}

export interface SkillDto {
  name: string;
  category: SkillCategory;
  description: string;
}

export interface FeaturedSkillDto {
  name: string;
  description: string;
  category: SkillCategory;
  icon: string;
}

export interface SocialDto {
  platform: string;
  url: string;
  icon: string;
}

export interface TimelineEventDto {
  title: string;
  subtitle: string;
  type: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface ProjectListDto {
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  courseName: string | null;
  highlighted: boolean;
}

export interface ProjectImageDto {
  title: string;
  imageUrl: string;
}

export interface ShowcaseDto {
  type: string;
  title: string;
  url: string;
  embedCode: string;
}

export interface DocumentDto {
  title: string;
  url: string;
}

export interface ProjectDetailDto {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  highlights: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  repositoryUrl: string;
  techStack: string[];
  images: ProjectImageDto[];
  showcases: ShowcaseDto[];
  documents: DocumentDto[];
  courseName: string | null;
  highlighted: boolean;
}

export interface HomeDto {
  profile: Profile;
  highlightedProjects: ProjectListDto[];
  allSkills: SkillDto[];
  featuredSkills: FeaturedSkillDto[];
  timelineEvents: TimelineEventDto[];
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Raw JSON shapes — the on-disk structure with bilingual { nl, en } fields.
// ─────────────────────────────────────────────────────────────────────────────

interface Localized { nl: string; en: string; }
interface LocalizedList { nl: string[]; en: string[]; }

interface RawProfile {
  name: string;
  role: Localized;
  focus: Localized;
  location: string;
  email: string;
  summary: Localized;
}

interface RawSkill {
  name: string;
  category: SkillCategory;
  description: Localized | null;
}

interface RawFeaturedSkill {
  name: Localized;
  description: Localized;
  category: SkillCategory;
  icon: string;
}

interface RawTimelineEvent {
  title: Localized;
  subtitle: Localized;
  type: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: Localized;
}

interface RawProjectList {
  slug: string;
  title: Localized;
  shortDescription: Localized;
  category: ProjectCategory;
  status: ProjectStatus;
  courseName: Localized | null;
  highlighted: boolean;
}

interface RawProjectDetail {
  slug: string;
  title: Localized;
  shortDescription: Localized;
  description: Localized;
  role: Localized;
  highlights: LocalizedList;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  repositoryUrl: string;
  courseName: Localized | null;
  highlighted: boolean;
  techStack: string[];
  images: ProjectImageDto[];
  showcases: ShowcaseDto[];
  documents: DocumentDto[];
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private http = inject(HttpClient);
  private langService = inject(LanguageService);

  private get lang(): Language {
    return this.langService.currentLang();
  }

  private pick(value: Localized): string {
    return value?.[this.lang] ?? value?.nl ?? '';
  }

  private pickList(value: LocalizedList): string[] {
    return value?.[this.lang] ?? value?.nl ?? [];
  }

  private pickOrNull(value: Localized | null): string | null {
    return value ? this.pick(value) : null;
  }

  private mapProfile(raw: RawProfile): Profile {
    return {
      name: raw.name,
      role: this.pick(raw.role),
      focus: this.pick(raw.focus),
      location: raw.location,
      email: raw.email,
      summary: this.pick(raw.summary)
    };
  }

  private mapSkill(raw: RawSkill): SkillDto {
    return {
      name: raw.name,
      category: raw.category,
      description: raw.description ? this.pick(raw.description) : ''
    };
  }

  private mapFeaturedSkill(raw: RawFeaturedSkill): FeaturedSkillDto {
    return {
      name: this.pick(raw.name),
      description: this.pick(raw.description),
      category: raw.category,
      icon: raw.icon
    };
  }

  private mapTimeline(raw: RawTimelineEvent): TimelineEventDto {
    return {
      title: this.pick(raw.title),
      subtitle: this.pick(raw.subtitle),
      type: raw.type,
      startDate: raw.startDate,
      endDate: raw.endDate,
      current: raw.current,
      description: this.pick(raw.description)
    };
  }

  private mapProjectList(raw: RawProjectList): ProjectListDto {
    return {
      slug: raw.slug,
      title: this.pick(raw.title),
      shortDescription: this.pick(raw.shortDescription),
      category: raw.category,
      status: raw.status,
      courseName: this.pickOrNull(raw.courseName),
      highlighted: raw.highlighted
    };
  }

  private mapProjectDetail(raw: RawProjectDetail): ProjectDetailDto {
    return {
      slug: raw.slug,
      title: this.pick(raw.title),
      shortDescription: this.pick(raw.shortDescription),
      description: this.pick(raw.description),
      role: this.pick(raw.role),
      highlights: this.pickList(raw.highlights),
      category: raw.category,
      status: raw.status,
      startDate: raw.startDate,
      endDate: raw.endDate,
      repositoryUrl: raw.repositoryUrl,
      techStack: raw.techStack,
      images: raw.images,
      showcases: raw.showcases,
      documents: raw.documents,
      courseName: this.pickOrNull(raw.courseName),
      highlighted: raw.highlighted
    };
  }

  getHome(): Observable<HomeDto> {
    return forkJoin({
      profile: this.http.get<RawProfile>('/data/profile.json'),
      projects: this.http.get<RawProjectList[]>('/data/projects.json'),
      skills: this.http.get<RawSkill[]>('/data/skills.json'),
      featuredSkills: this.http.get<RawFeaturedSkill[]>('/data/featured-skills.json'),
      timeline: this.http.get<RawTimelineEvent[]>('/data/timeline.json')
    }).pipe(
      map(data => ({
        profile: this.mapProfile(data.profile),
        highlightedProjects: data.projects
          .filter(p => p.highlighted)
          .map(p => this.mapProjectList(p)),
        allSkills: data.skills.map(s => this.mapSkill(s)),
        featuredSkills: data.featuredSkills.map(s => this.mapFeaturedSkill(s)),
        timelineEvents: data.timeline.map(t => this.mapTimeline(t))
      }))
    );
  }

  getProfile(): Observable<Profile> {
    return this.http.get<RawProfile>('/data/profile.json').pipe(
      map(raw => this.mapProfile(raw))
    );
  }

  getSkills(): Observable<SkillDto[]> {
    return this.http.get<RawSkill[]>('/data/skills.json').pipe(
      map(skills => skills.map(s => this.mapSkill(s)))
    );
  }

  getProjects(): Observable<ProjectListDto[]> {
    return this.http.get<RawProjectList[]>('/data/projects.json').pipe(
      map(projects => projects.map(p => this.mapProjectList(p)))
    );
  }

  getProjectBySlug(slug: string): Observable<ProjectDetailDto> {
    return this.http.get<RawProjectDetail>(`/data/projects/${slug}.json`).pipe(
      map(raw => this.mapProjectDetail(raw))
    );
  }

  getSocials(): Observable<SocialDto[]> {
    return this.http.get<SocialDto[]>('/data/socials.json');
  }

  getProjectsBySkill(_skillName: string): Observable<ProjectListDto[]> {
    // Skill-to-project filtering isn't modelled in the static data; return all.
    return this.getProjects();
  }

  sendContactMessage(request: ContactRequest): Observable<void> {
    // Using Formspree for contact form handling.
    return this.http.post<void>('https://formspree.io/f/YOUR_FORMSPREE_ID', {
      name: request.name,
      email: request.email,
      message: request.message
    });
  }
}
