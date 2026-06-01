import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';
import { environment } from '../../../environments/environment';
export type ProjectCategory = 'SCHOOL_PROJECT' | 'PERSONAL_PROJECT';
export type ProjectStatus = 'COMPLETED' | 'IN_PROGRESS';
export type SkillCategory = 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'DEVOPS' | 'TOOLS' | 'MOBILE' | 'CLOUD';
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
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
export interface HomeSectionDto {
  id: number;
  identifier: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  content: string;
  contentEn: string;
  sortOrder: number;
  type: 'HERO' | 'ABOUT' | 'FEATURED_SKILLS' | 'SKILLS' | 'PROJECTS' | 'TIMELINE' | 'CONTACT' | 'CUSTOM_TEXT';
  visible: boolean;
  showTerminal?: boolean;
}
export interface HomeDto {
  profile: Profile;
  highlightedProjects: ProjectListDto[];
  allSkills: SkillDto[];
  featuredSkills: FeaturedSkillDto[];
  timelineEvents: TimelineEventDto[];
  homeSections: HomeSectionDto[];
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
@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private langService = inject(LanguageService);
  private get langParams(): HttpParams {
    return new HttpParams().set('lang', this.langService.currentLang());
  }
  getHome(): Observable<ApiResponse<HomeDto>> {
    return this.http.get<ApiResponse<HomeDto>>(`${this.baseUrl}/home`, { params: this.langParams });
  }
  getProfile(): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.baseUrl}/profile`);
  }
  getSkills(): Observable<ApiResponse<SkillDto[]>> {
    return this.http.get<ApiResponse<SkillDto[]>>(`${this.baseUrl}/skills`, { params: this.langParams });
  }
  getProjects(): Observable<ApiResponse<ProjectListDto[]>> {
    return this.http.get<ApiResponse<ProjectListDto[]>>(`${this.baseUrl}/projects`, { params: this.langParams });
  }
  getProjectBySlug(slug: string): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.get<ApiResponse<ProjectDetailDto>>(`${this.baseUrl}/projects/${slug}`, { params: this.langParams });
  }
  getSocials(): Observable<ApiResponse<SocialDto[]>> {
    return this.http.get<ApiResponse<SocialDto[]>>(`${this.baseUrl}/socials`);
  }
  getProjectsBySkill(skillName: string): Observable<ApiResponse<ProjectListDto[]>> {
    return this.http.get<ApiResponse<ProjectListDto[]>>(
      `${this.baseUrl}/projects/by-skill/${encodeURIComponent(skillName)}`,
      { params: this.langParams }
    );
  }
  sendContactMessage(request: ContactRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/contact`, request);
  }
}
