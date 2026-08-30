import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LanguageService, Language } from './language.service';
import { environment } from '../../../environments/environment';
import {
  mapProfile,
  mapSkill,
  mapFeaturedSkill,
  mapTimeline,
  mapProjectList,
  mapProjectDetail,
  RawProfile,
  RawSkill,
  RawFeaturedSkill,
  RawTimelineEvent,
  RawProjectList,
  RawProjectDetail,
  Profile,
  SkillDto,
  FeaturedSkillDto,
  TimelineEventDto,
  ProjectListDto,
  ProjectDetailDto
} from './portfolio-mappers';

export type {
  ProjectCategory,
  ProjectStatus,
  SkillCategory,
  Profile,
  SkillDto,
  FeaturedSkillDto,
  TimelineEventDto,
  ProjectListDto,
  ProjectImageDto,
  ShowcaseDto,
  DocumentDto,
  ProjectDetailDto
} from './portfolio-mappers';

export interface SocialDto {
  platform: string;
  url: string;
  icon: string;
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

  getHome(): Observable<HomeDto> {
    return forkJoin({
      profile: this.raw<RawProfile>('/data/profile.json'),
      projects: this.raw<RawProjectList[]>('/data/projects.json'),
      skills: this.raw<RawSkill[]>('/data/skills.json'),
      featuredSkills: this.raw<RawFeaturedSkill[]>('/data/featured-skills.json'),
      timeline: this.raw<RawTimelineEvent[]>('/data/timeline.json')
    }).pipe(
      map(data => ({
        profile: mapProfile(data.profile, this.lang),
        highlightedProjects: data.projects
          .filter(p => p.highlighted)
          .map(p => mapProjectList(p, this.lang)),
        allSkills: data.skills.map(s => mapSkill(s, this.lang)),
        featuredSkills: data.featuredSkills.map(s => mapFeaturedSkill(s, this.lang)),
        timelineEvents: data.timeline.map(t => mapTimeline(t, this.lang))
      }))
    );
  }

  getProfile(): Observable<Profile> {
    return this.raw<RawProfile>('/data/profile.json').pipe(
      map(raw => mapProfile(raw, this.lang))
    );
  }

  getSkills(): Observable<SkillDto[]> {
    return this.raw<RawSkill[]>('/data/skills.json').pipe(
      map(skills => skills.map(s => mapSkill(s, this.lang)))
    );
  }

  getProjects(): Observable<ProjectListDto[]> {
    return this.raw<RawProjectList[]>('/data/projects.json').pipe(
      map(projects => projects.map(p => mapProjectList(p, this.lang)))
    );
  }

  getProjectBySlug(slug: string): Observable<ProjectDetailDto> {
    return this.raw<RawProjectDetail>(`/data/projects/${slug}.json`).pipe(
      map(raw => mapProjectDetail(raw, this.lang))
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
