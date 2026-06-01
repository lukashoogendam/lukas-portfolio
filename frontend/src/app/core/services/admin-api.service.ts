import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  ProjectDetailDto,
  SkillDto,
  SocialDto,
  Profile,
  TimelineEventDto,
  HomeSectionDto,
  FeaturedSkillDto
} from './portfolio-api.service';
import { environment } from '../../../environments/environment';
export interface ProjectTranslationRequest {
  title: string;
  shortDescription?: string;
  description?: string;
  role?: string;
  highlights?: string;
  features?: string[];
  courseName?: string;
}
export interface SkillTranslationRequest {
  description?: string;
}
export interface ProfileTranslationRequest {
  role?: string;
  focus?: string;
  summary?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;
  private http = inject(HttpClient);
  createProject(request: unknown): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.post<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects`, request, { withCredentials: true }
    );
  }
  updateProject(slug: string, request: unknown): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.put<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects/${slug}`, request, { withCredentials: true }
    );
  }
  deleteProject(slug: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/projects/${slug}`, { withCredentials: true }
    );
  }
  getProjectTranslation(slug: string, lang: string): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.get<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects/${slug}/translations/${lang}`, { withCredentials: true }
    );
  }
  upsertProjectTranslation(slug: string, lang: string, request: ProjectTranslationRequest): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.put<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects/${slug}/translations/${lang}`, request, { withCredentials: true }
    );
  }
  createSkill(request: unknown): Observable<ApiResponse<SkillDto>> {
    return this.http.post<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills`, request, { withCredentials: true }
    );
  }
  updateSkill(id: number, request: unknown): Observable<ApiResponse<SkillDto>> {
    return this.http.put<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills/${id}`, request, { withCredentials: true }
    );
  }
  deleteSkill(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/skills/${id}`, { withCredentials: true }
    );
  }
  getSkillTranslation(id: number, lang: string): Observable<ApiResponse<SkillDto>> {
    return this.http.get<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills/${id}/translations/${lang}`, { withCredentials: true }
    );
  }
  upsertSkillTranslation(id: number, lang: string, request: SkillTranslationRequest): Observable<ApiResponse<SkillDto>> {
    return this.http.put<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills/${id}/translations/${lang}`, request, { withCredentials: true }
    );
  }
  createSocial(request: unknown): Observable<ApiResponse<SocialDto>> {
    return this.http.post<ApiResponse<SocialDto>>(
      `${this.baseUrl}/socials`, request, { withCredentials: true }
    );
  }
  updateSocial(id: number, request: unknown): Observable<ApiResponse<SocialDto>> {
    return this.http.put<ApiResponse<SocialDto>>(
      `${this.baseUrl}/socials/${id}`, request, { withCredentials: true }
    );
  }
  deleteSocial(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/socials/${id}`, { withCredentials: true }
    );
  }
  updateProfile(request: unknown): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(
      `${this.baseUrl}/profile`, request, { withCredentials: true }
    );
  }
  getProfileTranslation(lang: string): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(
      `${this.baseUrl}/profile/translations/${lang}`, { withCredentials: true }
    );
  }
  upsertProfileTranslation(lang: string, request: ProfileTranslationRequest): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(
      `${this.baseUrl}/profile/translations/${lang}`, request, { withCredentials: true }
    );
  }
  uploadFile(file: File): Observable<ApiResponse<{ filename: string; url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ filename: string; url: string }>>(
      `${this.baseUrl}/files/upload`,
      formData,
      { withCredentials: true }
    );
  }

  // Timeline
  getTimelineEvents(): Observable<ApiResponse<TimelineEventDto[]>> {
    return this.http.get<ApiResponse<TimelineEventDto[]>>(`${this.baseUrl}/timeline`, { withCredentials: true });
  }
  createTimelineEvent(request: unknown): Observable<ApiResponse<TimelineEventDto>> {
    return this.http.post<ApiResponse<TimelineEventDto>>(`${this.baseUrl}/timeline`, request, { withCredentials: true });
  }
  updateTimelineEvent(id: number, request: unknown): Observable<ApiResponse<TimelineEventDto>> {
    return this.http.put<ApiResponse<TimelineEventDto>>(`${this.baseUrl}/timeline/${id}`, request, { withCredentials: true });
  }
  deleteTimelineEvent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/timeline/${id}`, { withCredentials: true });
  }

  // Home Sections
  getHomeSections(): Observable<ApiResponse<HomeSectionDto[]>> {
    return this.http.get<ApiResponse<HomeSectionDto[]>>(`${this.baseUrl}/home-sections`, { withCredentials: true });
  }
  createHomeSection(request: unknown): Observable<ApiResponse<HomeSectionDto>> {
    return this.http.post<ApiResponse<HomeSectionDto>>(`${this.baseUrl}/home-sections`, request, { withCredentials: true });
  }
  updateHomeSection(id: number, request: unknown): Observable<ApiResponse<HomeSectionDto>> {
    return this.http.put<ApiResponse<HomeSectionDto>>(`${this.baseUrl}/home-sections/${id}`, request, { withCredentials: true });
  }
  deleteHomeSection(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/home-sections/${id}`, { withCredentials: true });
  }

  // Reorder
  reorderProjects(slugs: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/projects/reorder`, slugs, { withCredentials: true });
  }
  reorderSkills(ids: number[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/skills/reorder`, ids, { withCredentials: true });
  }
  reorderHomeSections(ids: number[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/home-sections/reorder`, ids, { withCredentials: true });
  }

  // Featured Skills
  getFeaturedSkills(): Observable<ApiResponse<FeaturedSkillDto[]>> {
    return this.http.get<ApiResponse<FeaturedSkillDto[]>>(`${this.baseUrl}/featured-skills`, { withCredentials: true });
  }
  createFeaturedSkill(request: unknown): Observable<ApiResponse<FeaturedSkillDto>> {
    return this.http.post<ApiResponse<FeaturedSkillDto>>(`${this.baseUrl}/featured-skills`, request, { withCredentials: true });
  }
  updateFeaturedSkill(id: number, request: unknown): Observable<ApiResponse<FeaturedSkillDto>> {
    return this.http.put<ApiResponse<FeaturedSkillDto>>(`${this.baseUrl}/featured-skills/${id}`, request, { withCredentials: true });
  }
  deleteFeaturedSkill(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/featured-skills/${id}`, { withCredentials: true });
  }
  reorderFeaturedSkills(ids: number[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/featured-skills/reorder`, ids, { withCredentials: true });
  }
}
