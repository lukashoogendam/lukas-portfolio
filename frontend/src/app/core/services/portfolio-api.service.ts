import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LanguageService, Language } from './language.service';
import { environment } from '../../../environments/environment';

export type ProjectCategory = 'SCHOOL_PROJECT' | 'PERSONAL_PROJECT';
export type ProjectStatus = 'COMPLETED' | 'IN_PROGRESS';
export type SkillCategory = 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'DATA' | 'DEVOPS' | 'TOOLS' | 'MOBILE' | 'CLOUD';

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

  // Cache van rauwe HTTP-fetches. De statische JSON-bestanden veranderen niet
  // tijdens een sessie en bevatten beide talen, dus we halen elk bestand
  // hooguit één keer op en lokaliseren per subscription opnieuw met pick().
  private rawCache = new Map<string, Observable<unknown>>();

  private raw<T>(url: string): Observable<T> {
    let stream = this.rawCache.get(url) as Observable<T> | undefined;
    if (!stream) {
      stream = this.http.get<T>(url).pipe(shareReplay({ bufferSize: 1, refCount: false }));
      this.rawCache.set(url, stream);
    }
    return stream;
  }

  private pick(value: Localized): string {
    return value?.[this.lang] || value?.nl || '';
  }

  private pickList(value: LocalizedList): string[] {
    const v = value?.[this.lang];
    return (v && v.length) ? v : (value?.nl ?? []);
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
      profile: this.raw<RawProfile>('/data/profile.json'),
      projects: this.raw<RawProjectList[]>('/data/projects.json'),
      skills: this.raw<RawSkill[]>('/data/skills.json'),
      featuredSkills: this.raw<RawFeaturedSkill[]>('/data/featured-skills.json'),
      timeline: this.raw<RawTimelineEvent[]>('/data/timeline.json')
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
    return this.raw<RawProfile>('/data/profile.json').pipe(
      map(raw => this.mapProfile(raw))
    );
  }

  getSkills(): Observable<SkillDto[]> {
    return this.raw<RawSkill[]>('/data/skills.json').pipe(
      map(skills => skills.map(s => this.mapSkill(s)))
    );
  }

  getProjects(): Observable<ProjectListDto[]> {
    return this.raw<RawProjectList[]>('/data/projects.json').pipe(
      map(projects => projects.map(p => this.mapProjectList(p)))
    );
  }

  getProjectBySlug(slug: string): Observable<ProjectDetailDto> {
    return this.raw<RawProjectDetail>(`/data/projects/${slug}.json`).pipe(
      map(raw => this.mapProjectDetail(raw))
    );
  }

  getSocials(): Observable<SocialDto[]> {
    return this.raw<SocialDto[]>('/data/socials.json');
  }

  sendContactMessage(request: ContactRequest): Observable<void> {
    // Endpoint komt uit environment; vervang YOUR_FORMSPREE_ID door je eigen form-id.
    return this.http.post<void>(environment.formspreeEndpoint, {
      name: request.name,
      email: request.email,
      message: request.message
    });
  }
}
