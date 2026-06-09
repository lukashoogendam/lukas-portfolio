import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LanguageService } from './language.service';

export type ProjectCategory = 'SCHOOL_PROJECT' | 'PERSONAL_PROJECT';
export type ProjectStatus = 'COMPLETED' | 'IN_PROGRESS';
export type SkillCategory = 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'DEVOPS' | 'TOOLS' | 'MOBILE' | 'CLOUD';

export interface Profile {
  name: string;
  role: string;
  focus: string;
  location: string;
  summary: string;
  email: string;
}

export interface TimelineEventDto {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  sortOrder: number;
}


export interface HomeDto {
  profile: Profile;
  highlightedProjects: ProjectListDto[];
  allSkills: SkillDto[];
  featuredSkills: FeaturedSkillDto[];
  timelineEvents: TimelineEventDto[];
}

export interface SkillDto {
  id: number;
  name: string;
  category: SkillCategory;
  description: string;
  sortOrder: number;
}

export interface FeaturedSkillDto {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: SkillCategory;
  icon: string;
  sortOrder: number;
}

export interface ProjectListDto {
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  courseName: string | null;
  highlighted: boolean;
  sortOrder: number;
}

export interface ProjectDetailDto {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  highlights: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  repositoryUrl: string;
  techStack: string[];
  features: string[];
  images: ProjectImageDto[];
  showcases: ShowcaseDto[];
  documents: DocumentDto[];
  links: LinksDto;
  skillIds?: number[];
  courseName: string | null;
  documentUrl: string | null;
  highlighted: boolean;
}

export interface ProjectImageDto {
  title: string;
  imageUrl: string;
  sortOrder: number;
}

export interface ShowcaseDto {
  id: number;
  type: string;
  title: string;
  url: string;
  embedCode: string;
  sortOrder: number;
}

export interface DocumentDto {
  id: number;
  title: string;
  url: string;
  sortOrder: number;
}

export interface LinksDto {
  github: string;
}

export interface SocialDto {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// Raw JSON interfaces (with bilingual fields)
interface RawProfile extends Profile {
  roleEn?: string;
  focusEn?: string;
  summaryEn?: string;
}

interface RawProjectListDto extends ProjectListDto {
  shortDescriptionEn?: string;
}

interface RawProjectDetailDto extends ProjectDetailDto {
  titleEn?: string;
  shortDescriptionEn?: string;
  descriptionEn?: string;
  roleEn?: string;
  highlightsEn?: string;
  featuresEn?: string[];
}

interface RawTimelineEventDto extends TimelineEventDto {
  titleEn?: string;
  subtitleEn?: string;
  descriptionEn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private http = inject(HttpClient);
  private langService = inject(LanguageService);

  private isEn(): boolean {
    return this.langService.currentLang() === 'en';
  }

  private localizeProfile(raw: RawProfile): Profile {
    const en = this.isEn();
    return {
      name: raw.name,
      role: (en && raw.roleEn) ? raw.roleEn : raw.role,
      focus: (en && raw.focusEn) ? raw.focusEn : raw.focus,
      location: raw.location,
      summary: (en && raw.summaryEn) ? raw.summaryEn : raw.summary,
      email: raw.email
    };
  }

  private localizeProjectList(raw: RawProjectListDto): ProjectListDto {
    const en = this.isEn();
    return {
      ...raw,
      shortDescription: (en && raw.shortDescriptionEn) ? raw.shortDescriptionEn : raw.shortDescription
    };
  }

  private localizeProjectDetail(raw: RawProjectDetailDto): ProjectDetailDto {
    const en = this.isEn();
    return {
      ...raw,
      title: (en && raw.titleEn) ? raw.titleEn : raw.title,
      shortDescription: (en && raw.shortDescriptionEn) ? raw.shortDescriptionEn : raw.shortDescription,
      description: (en && raw.descriptionEn) ? raw.descriptionEn : raw.description,
      role: (en && raw.roleEn) ? raw.roleEn : raw.role,
      highlights: (en && raw.highlightsEn) ? raw.highlightsEn : raw.highlights,
      features: (en && raw.featuresEn) ? raw.featuresEn : raw.features
    };
  }

  private localizeTimeline(raw: RawTimelineEventDto): TimelineEventDto {
    const en = this.isEn();
    return {
      ...raw,
      title: (en && raw.titleEn) ? raw.titleEn : raw.title,
      subtitle: (en && raw.subtitleEn) ? raw.subtitleEn : raw.subtitle,
      description: (en && raw.descriptionEn) ? raw.descriptionEn : raw.description
    };
  }

  getHome(): Observable<HomeDto> {
    return forkJoin({
      profile: this.http.get<RawProfile>('/data/profile.json'),
      projects: this.http.get<RawProjectListDto[]>('/data/projects.json'),
      skills: this.http.get<SkillDto[]>('/data/skills.json'),
      featuredSkills: this.http.get<FeaturedSkillDto[]>('/data/featured-skills.json'),
      timeline: this.http.get<RawTimelineEventDto[]>('/data/timeline.json')
    }).pipe(
      map(data => ({
        profile: this.localizeProfile(data.profile),
        highlightedProjects: data.projects
          .filter(p => p.highlighted)
          .map(p => this.localizeProjectList(p)),
        allSkills: data.skills,
        featuredSkills: data.featuredSkills,
        timelineEvents: data.timeline.map(t => this.localizeTimeline(t))
      }))
    );
  }

  getProfile(): Observable<Profile> {
    return this.http.get<RawProfile>('/data/profile.json').pipe(
      map(raw => this.localizeProfile(raw))
    );
  }

  getSkills(): Observable<SkillDto[]> {
    return this.http.get<SkillDto[]>('/data/skills.json');
  }

  getProjects(): Observable<ProjectListDto[]> {
    return this.http.get<RawProjectListDto[]>('/data/projects.json').pipe(
      map(projects => projects.map(p => this.localizeProjectList(p)))
    );
  }

  getProjectBySlug(slug: string): Observable<ProjectDetailDto> {
    return this.http.get<RawProjectDetailDto>(`/data/projects/${slug}.json`).pipe(
      map(raw => this.localizeProjectDetail(raw))
    );
  }

  getSocials(): Observable<SocialDto[]> {
    return this.http.get<SocialDto[]>('/data/socials.json');
  }

  getProjectsBySkill(skillName: string): Observable<ProjectListDto[]> {
    // Load all projects and filter client-side by skill
    // Since we don't have skill-to-project mapping in the list view,
    // we return all projects for now (the skill filter can be enhanced later)
    return this.getProjects();
  }

  sendContactMessage(request: ContactRequest): Observable<void> {
    // Using Formspree for contact form handling
    // Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
    // Sign up at https://formspree.io to get your form endpoint
    return this.http.post<void>('https://formspree.io/f/YOUR_FORMSPREE_ID', {
      name: request.name,
      email: request.email,
      message: request.message
    });
  }
}
