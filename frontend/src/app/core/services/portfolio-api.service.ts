import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';

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
  github: string;
  linkedin: string;
}

export interface SkillDto {
  id: number;
  name: string;
  category: string;
  level: string;
  description: string;
}

export interface ProjectListDto {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  status: string;
}

export interface ProjectDetailDto {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  highlights: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  repositoryUrl: string;
  techStack: string[];
  features: string[];
  images: ProjectImageDto[];
  showcases: ShowcaseDto[];
  documents: DocumentDto[];
  links: LinksDto;
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

export interface AssignmentDto {
  id: number;
  slug: string;
  title: string;
  courseName: string;
  description: string;
  projectSlug: string;
  projectTitle: string;
  documentUrl: string;
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

  private readonly baseUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);
  private langService = inject(LanguageService);

  private get langParams(): HttpParams {
    return new HttpParams().set('lang', this.langService.currentLang());
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

  getAssignments(): Observable<ApiResponse<AssignmentDto[]>> {
    return this.http.get<ApiResponse<AssignmentDto[]>>(`${this.baseUrl}/assignments`, { params: this.langParams });
  }

  getAssignmentBySlug(slug: string): Observable<ApiResponse<AssignmentDto>> {
    return this.http.get<ApiResponse<AssignmentDto>>(`${this.baseUrl}/assignments/${slug}`, { params: this.langParams });
  }

  getSocials(): Observable<ApiResponse<SocialDto[]>> {
    return this.http.get<ApiResponse<SocialDto[]>>(`${this.baseUrl}/socials`);
  }

  sendContactMessage(request: ContactRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/contact`, request);
  }
}
